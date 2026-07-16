<?php

namespace App\Http\Controllers\Web\Docs;

use App\Http\Controllers\Controller;
use App\Models\Base\User;

class DocInfoController extends Controller
{
    public function index()
    {
        $relations = $this->loadModules([]);

        return view('pages.doc-info.index', [
            'data' => $relations,
        ]);
    }

    private function loadModules($relations)
    {
        $modules = array_merge(
            [
                User::class,
            ],
        );

        foreach ($modules as $v) {
            $rel = (new $v)->publicRelations();
            $relations[$rel['name']] = [
                'relations' => empty($rel['relations']) ? '-' : $rel['relations'],
            ];
        }

        return $relations;
    }
}