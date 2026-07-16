<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <title>{{ config('app.name', 'Laravel') }}</title>
    @component('components.part.app_head')
    @endcomponent
</head>

<body>
    <div>
        <main class="py-4">
            @yield('content')
        </main>
    </div>


    @yield('modal')
    @yield('script')
</body>

</html>
