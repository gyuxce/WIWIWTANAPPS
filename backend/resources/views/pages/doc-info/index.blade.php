@extends('layouts.app_no_nav')
@section('content')
    <div class="container">
        <h2 class="mt-5">Users for Dev, password => password</h2>
        <ul>
            <li>implementer@62teknologi.com</li>
        </ul>

        <h2 class="mt-5">Public Token</h2>
        <p>{{ config('api_public_token') }}</p>

        <h2 class="mt-5">Model Relations</h2>
        @foreach ($data as $item => $k)
            <ul>
                <li><strong>{{ $item }}</strong></li>
                <ul>
                    @php
                        $p = $k['relations'];
                    @endphp
                    @if (is_array($p))
                        @foreach ($k['relations'] as $i)
                            <li>
                                <div>
                                    model => {{ $i['model'] ?? '' }},
                                    name => <strong>{{ $i['name'] ?? '' }}</strong>
                                </div>

                            </li>
                        @endforeach
                    @else
                        {{ $k['relations'] }}
                    @endif
                </ul>
            </ul>
        @endforeach


    </div>
@endsection
