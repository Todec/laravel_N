<!doctype html>
<html lang="{{ htmlLang() }}" @langrtl dir="rtl" @endlangrtl>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ appName() }} | @yield('title')</title>
    <meta name="description" content="@yield('meta_description', appName())">
    <meta name="author" content="@yield('meta_author', 'Rion')">
    <link rel="shortcut icon" type="image/png" href="{{ asset('favicon.ico') }}"/>
    @yield('meta')
    @include('frontend.includes.styles')
    @stack('before-styles')
    
    <livewire:styles />
    @stack('after-styles')
    @include('includes.partials.ga')
</head>
<body class="home page-template page-template-elementor_header_footer page page-id-493 compare-property-active elementor-default elementor-template-full-width elementor-kit-2741 elementor-page elementor-page-493">
    <div id="app">
        @include('frontend.includes.header')
        @include('includes.partials.messages')

        <main>
            @yield('content')
        </main>
        @include('frontend.includes.footer')
    </div><!--app-->

    @stack('before-scripts')
    @include('frontend.includes.scripts')
    <livewire:scripts />
    @stack('after-scripts')
</body>
</html>
