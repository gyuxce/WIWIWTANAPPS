<?php

namespace App\Policies\Finance;
use App\Models\Finance\PaymentAdapter;
use App\Models\Base\User;
use Illuminate\Auth\Access\Response;


class PaymentAdapterPolicy {

public function before(User $user, string $ability): bool|null 
{
//if ($user->isSuperadmin()) {
//return true;
//}
return null;
}

public function viewAny(?User $user)
{
return Response::allow();
// return  Response::deny('You can not access this data.');
}

public function view(?User $user, PaymentAdapter $row)
{
return Response::allow();
// return  Response::deny('You can not access this data.');
}

public function create(?User $user)
{
return Response::allow();
// return  Response::deny('You can not access this data.');
}

public function update(?User $user, PaymentAdapter $row)
{
return Response::allow();
// return  Response::deny('You can not access this data.');
}

public function delete(?User $user, PaymentAdapter $row)
{
return Response::allow();
// return  Response::deny('You can not access this data.');
}

public function bulkDelete(?User $user, $args)
{
// $args['ids'] 
return Response::allow();
// return  Response::deny('You can not access this data.');
}

public function forceDelete(?User $user, PaymentAdapter $row)
{
return Response::allow();
// return  Response::deny('You can not access this data.');
}

}