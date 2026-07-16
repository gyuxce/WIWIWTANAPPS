<?php

namespace App\Services\BaseCrud\Traits;

use App\Models\Service\Appointment;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;

trait HasCrudPrepareQuery
{
    public $disableOrderList = false;

    public $searchKeyword = 'q';

    public $customSearchable = [
        // [
        //     'morph' => 'refable',
        //     'class' => Appointment::class,
        //     'searchable' => []
        // ]
    ];

    public function __prepareQuerySearchAbleList()
    {
        $query = $this->query;

        $request = $this->requestData;

        if ($q = $request->query($this->searchKeyword)) {

            $query->where(function ($qq) use ($q) {
                $lower = "LOWER";
                $like = "like";
                foreach ($this->searchAble as $v) {
                    if (Str::contains($v, '.')) {
                        $ex = explode('.', $v);

                        $rel = implode('.', array_values(array_slice($ex, 0, count($ex) - 1)));

                        $qq->orWhereHas($rel, function ($qqq) use ($q, $ex, $lower, $like) {
                            $qqq->whereRaw(
                                $lower . '(' . $ex[count($ex) - 1] . ') ' . $like . ' ?',
                                ['%' . strtolower($q) . '%']
                            );
                        });
                    } else {
                        $qq->orWhereRaw($lower . '(' . $v . ') ' . $like . ' ?', ['%' . strtolower($q) . '%']);
                    }
                }
                $this->additionalSearchable($qq, $q);
            });
        }

        return $query;
    }

    public function __prepareQueryOptionsList()
    {
        $query = $this->query;

        $request = $this->requestData;

        $options = $request->query('options');

        $search = [];
        $filter = [];
        $has = [];
        $doesntHave = [];

        $operations = [
            'equal' => '=',
            'not_equal' => '!=',
            'in' => 'IN',
            'not_in' => 'NOT IN',
            'less_then' => '<',
            'greater_than' => '>',
            'less_then_equal' => '<=',
            'greater_than_equal' => '>=',
            'is_null' => 'IS NULL',
            'is_not_null' => 'IS NOT NULL',
            'between' => 'BETWEEN',
            'not_between' => 'NOT BETWEEN'
        ];

        if (!empty($options) && is_array($options)) {

            foreach ($options as $o) {
                $x = explode(',', $o);
                $key = $x[0] ?? '';
                if ($key == 'search') {
                    $search[] = $x;
                }
                if ($key == 'filter') {
                    $filter[] = $x;
                }
                if ($key == 'has') {
                    $has[] = $x;
                }
                if ($key == 'doesntHave') {
                    $doesntHave[] = $x;
                }
            }
        }

        if (!empty($search)) {
            $query->where(function ($query) use ($search) {
                $lower = "LOWER";
                $like = "like";

                foreach ($search as $v) {

                    if (empty($v[1]) || !isset($v[2])) {
                        continue;
                    }

                    if (Str::contains($v[1], '.')) {
                        $ex = explode('.', $v[1]);
                        $rel = implode('.', array_values(array_slice($ex, 0, count($ex) - 1)));

                        $query->whereHas($rel, function ($query) use ($v, $ex, $lower, $like) {
                            $query->whereRaw(
                                $lower . '(' . $ex[count($ex) - 1] . ') ' . $like . ' ?',
                                ['%' . strtolower($v[2]) . '%']
                            );
                        });
                    } else {
                        $query->whereRaw($lower . '(' . $v[1] . ') ' . $like . ' ?', ['%' . strtolower($v[2]) . '%']);
                    }
                }
            });
        }

        if (!empty($filter)) {
            $query->where(function ($query) use ($filter, $operations) {

                foreach ($filter as $v) {

                    if (empty($v[1]) || empty($v[2]) || empty($operations[$v[2]])) {
                        continue;
                    }

                    if (Str::contains($v[1], '.')) {
                        $ex = explode('.', $v[1]);
                        $rel = implode('.', array_values(array_slice($ex, 0, count($ex) - 1)));

                        $query->whereHas($rel, function ($query) use ($v, $ex, $operations) {
                            $field = $ex[count($ex) - 1];
                            $op = $operations[$v[2]];
                            if ($op == 'IN') {
                                $query->whereIn($field, explode('|', $v[3]));
                            } elseif ($op == 'NOT IN') {
                                $query->whereIn($field, explode('|', $v[3]));
                            } elseif ($op == 'IS NULL') {
                                $query->whereNull($field);
                            } elseif ($op == 'IS NOT NULL') {
                                $query->whereNotNull($field);
                            } elseif ($op == 'BETWEEN') {
                                $range = explode('|', $v[3]);
                                $query->whereBetween($field, [$range[0], $range[1]]);
                            } elseif ($op == 'NOT BETWEEN') {
                                $range = explode('|', $v[3]);
                                $query->whereNotBetween($field, [$range[0], $range[1]]);
                            } else {
                                $query->where($field, $op, $v[3]);
                            }
                        });
                    } else {
                        $field = $v[1];
                        $op = $operations[$v[2]];
                        if ($op == 'IN') {
                            $query->whereIn($field, explode('|', $v[3]));
                        } elseif ($op == 'NOT IN') {
                            $query->whereIn($field, explode('|', $v[3]));
                        } elseif ($op == 'IS NULL') {
                            $query->whereNull($field);
                        } elseif ($op == 'IS NOT NULL') {
                            $query->whereNotNull($field);
                        } elseif ($op == 'BETWEEN') {
                            $range = explode('|', $v[3]);
                            $query->whereBetween($field, [$range[0], $range[1]]);
                        } elseif ($op == 'NOT BETWEEN') {
                            $range = explode('|', $v[3]);
                            $query->whereNotBetween($field, [$range[0], $range[1]]);
                        } else {
                            $query->where($field, $op, $v[3]);
                        }
                    }
                }
            });
        }


        if (!empty($has)) {
            $query->where(function ($query) use ($has) {
                foreach ($has as $v) {
                    if (empty($v[1])) {
                        continue;
                    }
                    $query->has($v[1]);
                }
            });
        }


        if (!empty($doesntHave)) {
            $query->where(function ($query) use ($doesntHave) {
                foreach ($doesntHave as $v) {
                    if (empty($v[1])) {
                        continue;
                    }
                    $query->doesntHave($v[1]);
                }
            });
        }



        return $query;
    }

    public function additionalSearchable($query, $q)
    {
        foreach ($this->customSearchable as $data) {
            foreach ($data['searchable'] as $v) {
                $query->orWhereHasMorph($data['morph'], $data['class'], function ($qq) use ($q, $v) {
                    if (Str::contains($v, '.')) {
                        $ex = explode('.', $v);

                        $rel = implode('.', array_values(array_slice($ex, 0, count($ex) - 1)));

                        $qq->whereHas($rel, function ($qqq) use ($q, $ex) {
                            $qqq->whereRaw('LOWER(' . $ex[count($ex) - 1] . ') like ?', ['%' . strtolower($q) . '%']);
                        });
                    } else {
                        $qq->whereRaw('LOWER(' . $v . ') like ?', ['%' . strtolower($q) . '%']);
                    }
                });
            }
        }
    }

    public function __prepareQueryListType()
    {
        $query = $this->query;

        $request = $this->requestData;

        if ($request->query('type') == 'pagination') {
            $query = $query->paginate($this->paginationPerPage);
            $this->__prepareListPaginationAppend($query);

            return $query;
        }

        return $query->get();
    }

    public function __prepareListPaginationAppend($query)
    {
        $request = $this->requestData;

        foreach ($request->query() as $key => $value) {
            $query->appends($key, $value);
        }

        return $query;
    }

    public function __prepareCacheResult()
    {
        $request = $this->requestData;

        if ($request->query("is_cache") == "1") {
            $key = Request::getRequestUri();

            $dt = Cache::get($key);
            if (!empty($dt)) {
                return $dt;
            }
        }
    }

    public function __prepareQueryRelationList()
    {
        $query = $this->query;

        foreach ($this->relationList as $value) {
            $query->with($value);
        }

        return $query;
    }

    public function __prepareQueryList()
    {
        return $this->query;
    }

    public function __prepareQuerySortOrderList()
    {
        $query = $this->query;

        if ($this->disableOrderList) {
            return $query;
        }

        $request = $this->requestData;

        $sort_by = $request->query('sort_by');

        $order_by = $request->query('order_by');

        if (Str::contains($order_by, '.')) {
            $ex = explode('.', $order_by);

            $rel = implode('.', array_values(array_slice($ex, 0, count($ex) - 1)));
            $relations = $this->model::RELATIONS;

            if ($relations[$rel]) {
                $query = $query->leftjoin($relations[$rel]['table'], $relations[$rel]['table'] . '.id', '=', app($this->model)->getTable() . '.' . $relations[$rel]['field'])
                ->orderBy($relations[$rel]['table'] . "." . $ex[count($ex) - 1], $sort_by);
            }

            $query = $query->addSelect(app($this->model)->getTable().'.*');

        } else {
            if ($this->disableOrderList) {
                return $query;
            }

            $order_by = !empty($order_by) ? $order_by : $this->defaultOrder;

            $sort_by = !empty($sort_by) ? $sort_by : $this->defaultSort;

            $query->orderBy($order_by, $sort_by);

            return $query;
        }

        return $query;
    }

    public function __prepareQueryLimitList()
    {
        $query = $this->query;

        $request = $this->requestData;

        $type = $request->query('type');

        $limit = $request->query('limit');

        if (!empty($limit)) {

            $this->paginationPerPage = (int) $limit;
            if ($type != 'pagination') {
                $query->limit($this->paginationPerPage);
            }
        }

        return $query;
    }

    public function __prepareDataStore($data)
    {
        return $data;
    }

    public function __prepareQueryRelationShow()
    {
        $query = $this->query;

        foreach ($this->relationShow as $value) {
            $query->with($value);
        }

        return $query;
    }

    public function __prepareLoadRelation($row)
    {
        if (!$this->lockRelationParam) {
            $relations = request('relations', '');
            if (!empty($relations)) {
                $exp = explode(',', $relations);
                $rel = [];
                foreach ($exp as $relation) {
                    if (!empty(trim($relation))) {
                        $rel[] = trim($relation);
                    }
                }
                if (!empty($rel)) {
                    $row->load($rel);
                }
            }
        }

        return $row;
    }


    public function __prepareQueryUnLockRelations()
    {
        $query = $this->query;

        if (!$this->lockRelationParam) {
            $relations = request('relations', '');
            if (!empty($relations)) {
                $exp = explode(',', $relations);
                foreach ($exp as $relation) {
                    $query->with(trim($relation));
                }
            }
        }

        return $query;
    }


    public function __prepareDataUpdate($data)
    {
        return $data;
    }

    public function __prepareQueryRowShow()
    {
        return $this->query;
    }

    public function __prepareQueryRowUpdate()
    {
        return $this->query;
    }

    public function __prepareQueryRowDestroy()
    {
        return $this->query;
    }

    public function __prepareQueryBulkDestroy()
    {
        return $this->query;
    }
}
