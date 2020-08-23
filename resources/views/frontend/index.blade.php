@extends('frontend.layouts.app')

@section('title',  __('Home'))

@section('content')   
<div id="section-body">
    @include('includes.partials.messages')
    @include('frontend.pages.home.search')
    @include('frontend.pages.home.main')
</div> <!-- End #section-body -->
@endsection
