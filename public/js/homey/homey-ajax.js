jQuery(document).ready(function ($) {
    "use strict";

    if ( typeof HOMEY_ajax_vars !== "undefined" ) {
        
        var ajaxurl = HOMEY_ajax_vars.admin_url+ 'admin-ajax.php';
        var login_redirect_type = HOMEY_ajax_vars.redirect_type;
        var login_redirect = HOMEY_ajax_vars.login_redirect;
        var is_singular_listing = HOMEY_ajax_vars.is_singular_listing;
        var paypal_connecting = HOMEY_ajax_vars.paypal_connecting;
        var login_sending = HOMEY_ajax_vars.login_loading;
        var process_loader_spinner = HOMEY_ajax_vars.process_loader_spinner;
        var currency_updating_msg = HOMEY_ajax_vars.currency_updating_msg;
        var homey_date_format = HOMEY_ajax_vars.homey_date_format;
        var userID = HOMEY_ajax_vars.user_id;
        var homey_reCaptcha = HOMEY_ajax_vars.homey_reCaptcha;
        var is_listing_detail = HOMEY_ajax_vars.is_listing_detail;
        var booked_hours_array = HOMEY_ajax_vars.booked_hours_array;
        var pending_hours_array = HOMEY_ajax_vars.pending_hours_array;
        var booking_start_hour = HOMEY_ajax_vars.booking_start_hour;
        var booking_end_hour = HOMEY_ajax_vars.booking_end_hour;
        var homey_min_book_days = HOMEY_ajax_vars.homey_min_book_days;

        if( booked_hours_array !=='' && booked_hours_array.length !== 0 ) {
            booked_hours_array   = JSON.parse (booked_hours_array);
        }

        if( pending_hours_array !=='' && pending_hours_array.length !== 0 ) {
            pending_hours_array   = JSON.parse (pending_hours_array);
        }

        var is_tansparent = HOMEY_ajax_vars.homey_tansparent;
        var retina_logo = HOMEY_ajax_vars.retina_logo;
        var retina_logo_splash = HOMEY_ajax_vars.retina_logo_splash;
        var retina_logo_mobile = HOMEY_ajax_vars.retina_logo_mobile;
        var retina_logo_mobile_splash = HOMEY_ajax_vars.retina_logo_mobile_splash;
        var no_more_listings = HOMEY_ajax_vars.no_more_listings;
        var allow_additional_guests = HOMEY_ajax_vars.allow_additional_guests;
        var allowed_guests_num = HOMEY_ajax_vars.allowed_guests_num;
        var num_additional_guests = HOMEY_ajax_vars.num_additional_guests;
        var agree_term_text = HOMEY_ajax_vars.agree_term_text;
        var choose_gateway_text = HOMEY_ajax_vars.choose_gateway_text;
        var success_icon = HOMEY_ajax_vars.success_icon;
        var calendar_link = HOMEY_ajax_vars.calendar_link;
        var focusedInput_2 = null;

        var allowed_guests_plus_additional = parseInt(allowed_guests_num) + parseInt(num_additional_guests);
        
        var compare_url = HOMEY_ajax_vars.compare_url;
        var add_compare = HOMEY_ajax_vars.add_compare;
        var remove_compare = HOMEY_ajax_vars.remove_compare;
        var compare_limit = HOMEY_ajax_vars.compare_limit;
        var homey_booking_type = HOMEY_ajax_vars.homey_booking_type;

        var homey_is_rtl = HOMEY_ajax_vars.homey_is_rtl;

        if( homey_is_rtl == 'yes' ) {
            homey_is_rtl = true;
        } else {
            homey_is_rtl = false;
        }

        var homey_is_mobile = false;
        if (/Android|webOS|iPhone|iPad|iPod|tablet|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            homey_is_mobile = true;
        }

        var homey_window_width = $( window ).width();

         /*var homey_timeStamp_2 = function(str) {
          return new Date(str.replace(/^(\d{2}\-)(\d{2}\-)(\d{4})$/,
            '$2$1$3')).getTime();
        };*/

        var homey_timeStamp_2 = function(str) {
                var myDate=str.split("-");
                var newDate=myDate[1]+"/"+myDate[0]+"/"+myDate[2];
                return new Date(newDate).getTime();
        };
        /*--------------------------------------------------------------------------
         *   Retina Logo
         * -------------------------------------------------------------------------*/
        if (window.devicePixelRatio == 2) {

            if(is_tansparent) {
                if(retina_logo_splash != '') {
                    $(".transparent-header .homey_logo img").attr("src", retina_logo_splash);
                }

                if(retina_logo_mobile_splash != '') {
                    $(".mobile-logo img").attr("src", retina_logo_mobile_splash);
                }

            } else { 
                if(retina_logo != '') {
                    $(".homey_logo img").attr("src", retina_logo);
                }

                if(retina_logo_mobile != '') {
                    $(".mobile-logo img").attr("src", retina_logo_mobile);
                }
            }
        }


        /* ------------------------------------------------------------------------ */
        /*  Paypal single listing payment
         /* ------------------------------------------------------------------------ */
        $('#homey_complete_order').on('click', function(e) {
            e.preventDefault();
            var hform, payment_gateway, listing_id, is_upgrade;

            payment_gateway = $("input[name='homey_payment_type']:checked").val();
            is_upgrade = $("input[name='is_upgrade']").val();

            listing_id = $('#listing_id').val();

            if( payment_gateway == 'paypal' ) {
                homey_processing_modal( paypal_connecting );
                homey_paypal_payment( listing_id, is_upgrade);

            } else if ( payment_gateway == 'stripe' ) {
                var hform = $(this).parents('.dashboard-area');
                hform.find('.homey_stripe_simple button').trigger("click");
            }
            return;

        });

        var homey_processing_modal = function ( msg ) {
            var process_modal ='<div class="modal fade" id="homey_modal" tabindex="-1" role="dialog" aria-labelledby="homeyModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-body homey_messages_modal">'+msg+'</div></div></div></div></div>';
            jQuery('body').append(process_modal);
            jQuery('#homey_modal').modal();
        }

        var homey_processing_modal_close = function ( ) {
            jQuery('#homey_modal').modal('hide');
        }




        /* ------------------------------------------------------------------------ */
        /* Set date format
        /* ------------------------------------------------------------------------ */
        var homey_convert_date = function(date) {

            if(date == '') {
                return '';
            }
     
            var d_format, return_date;
            
            d_format = homey_date_format.toUpperCase();

            var changed_date_format = d_format.replace("YY", "YYYY");
            var return_date = moment(date, changed_date_format).format('YYYY-MM-DD');

            return return_date;
         
        }


        // Single listing booking form
        $("#single-listing-date-range input").on('focus', function() {
            $('.single-listing-booking-calendar-js').css("display", "block");
            $('.single-listing-booking-calendar-js').addClass("arrive_active");
            $('.single-form-guests-js').css("display", "none");
            focusedInput_2 = $(this).attr('name');
            $('.single-listing-booking-calendar-js').removeClass('arrive_active depart_active').addClass(focusedInput_2+'_active');
        });

        $(".single-guests-js input").on('focus', function() {
            $(this).prev("label").css("display", "block");
            $(this).addClass("on-focus");
            $('.single-form-guests-js').css("display", "block");
        });

        var numClicks = 0;
        var fromTimestamp_2, toTimestamp_2 = 0; // init start and end timestamps

        var homey_booking_dates = function() {
            
            $('.single-listing-booking-calendar-js ul li').on('click', function() {
                var $this = $(this);

                if($this.hasClass('past-day') || $this.hasClass('homey-not-available-for-booking')) {
                    if(!$this.hasClass('reservation_start')) {
                        return false;
                    }
                }

                numClicks += 1;
                var vl = $this.data('formatted-date');
                var timestamp = $this.data('timestamp');

                // if modify days after selecting once
                if (focusedInput_2 == 'depart' && timestamp > fromTimestamp_2) {

                    $('.single-listing-calendar-wrap ul').find('li.to-day').removeClass('selected')
                        .siblings().removeClass('to-day in-between');

                    numClicks = 2;
                }

                if( numClicks == 1 ) {
                    fromTimestamp_2 = timestamp;

                    //day nodes
                    $('.single-listing-calendar-wrap ul li').removeClass('to-day from-day selected in-between');
                    $this.addClass('from-day selected');
                    // move caret
                    $('.single-listing-booking-calendar-js').removeClass('arrive_active').addClass('depart_active');

                    $('input[name="arrive"]').val(vl);
                    $('input[name="depart"]').val('');

                    if(homey_booking_type == 'per_day') {
                        homey_calculate_price_checkin();
                    }
                    
                } else if(numClicks == 2) {

                    toTimestamp_2 = timestamp;
                    //day end node
                    $this.addClass('to-day selected');
                    $('.single-listing-booking-calendar-js').removeClass('depart_active').addClass('arrive_active');

                    var check_in_date = $('input[name="arrive"]').val();
                    check_in_date = homey_timeStamp_2(check_in_date);
                    var check_out_date = homey_timeStamp_2(vl);

                    if(check_in_date >= check_out_date) {
                        fromTimestamp_2 = timestamp;
                        toTimestamp_2 = 0;
                        //day nodes
                        $('.single-listing-calendar-wrap ul li').removeClass('to-day from-day selected in-between');
                        $this.addClass('from-day selected');

                        // move caret
                        $('.single-listing-booking-calendar-js').removeClass('arrive_active').addClass('depart_active');

                        $('input[name="arrive"]').val(vl);
                        numClicks = 1;
                    } else {
                        setInBetween_2(fromTimestamp_2, toTimestamp_2);
                        $('input[name="depart"]').val(vl);
                        $('#single-booking-search-calendar, #single-overlay-booking-search-calendar').hide();

                        if(homey_booking_type == 'per_day') {
                            homey_calculate_price_checkout();
                        }
                    }
                }
                if(numClicks == 2) { 
                    numClicks = 0; 
                }

            });
        }
        

        //Run only for daily/nighty booking

        if(homey_booking_type == 'per_day') {

            homey_booking_dates();

            $('.single-listing-calendar-wrap ul li').on('hover', function () {

                var ts = $(this).data('timestamp');
                if (numClicks == 1) {
                    setInBetween_2(fromTimestamp_2, ts);
                }
            });
            /*
            * method to send in-between days
            * */
            var setInBetween_2 = function(fromTime, toTime) {
                $('.single-listing-calendar-wrap ul li').removeClass('in-between')
                    .filter(function () {
                        var currentTs = $(this).data('timestamp');
                        return currentTs > fromTime && currentTs < toTime;
                    }).addClass('in-between');
            }


            var homey_calculate_price_checkin = function() {
                var check_in_date = $('input[name="arrive"]').val();
                check_in_date = homey_convert_date(check_in_date);

                var check_out_date = $('input[name="depart"]').val();
                check_out_date = homey_convert_date(check_out_date);

                var guests = $('input[name="guests"]').val();
                var listing_id = $('#listing_id').val();
                var security = $('#reservation-security').val();
                homey_calculate_booking_cost(check_in_date, check_out_date, guests, listing_id, security);
            }
            homey_calculate_price_checkin();

            var homey_calculate_price_checkout = function() {
                var check_in_date = $('input[name="arrive"]').val();
                check_in_date = homey_convert_date(check_in_date);

                var check_out_date = $('input[name="depart"]').val();
                check_out_date = homey_convert_date(check_out_date);

                var guests = $('input[name="guests"]').val();
                var listing_id = $('#listing_id').val();
                var security = $('#reservation-security').val();
                homey_calculate_booking_cost(check_in_date, check_out_date, guests, listing_id, security);
                check_booking_availability_on_date_change(check_in_date, check_out_date, listing_id, security);
            }
            
            $('.apply_guests').on('click', function () {
                var check_in_date = $('input[name="arrive"]').val();
                check_in_date = homey_convert_date(check_in_date);

                var check_out_date = $('input[name="depart"]').val();
                check_out_date = homey_convert_date(check_out_date);

                var guests = $('input[name="guests"]').val();
                var listing_id = $('#listing_id').val();
                var security = $('#reservation-security').val();
                homey_calculate_booking_cost(check_in_date, check_out_date, guests, listing_id, security);
                check_booking_availability_on_date_change(check_in_date, check_out_date, listing_id, security);
            });

            $('.homey_extra_price input').on('click', function(){
                var extra_options = []; var temp_opt;

                $('.homey_extra_price input').each(function() {

                    if( ($(this).is(":checked")) ) {
                        var extra_name = $(this).data('name');
                        var extra_price = $(this).data('price');
                        var extra_type = $(this).data('type');
                        temp_opt    =   '';
                        temp_opt    =   extra_name;
                        temp_opt    =   temp_opt + '|' + extra_price;
                        temp_opt    =   temp_opt + '|' + extra_type;
                        extra_options.push(temp_opt);
                    }
                    
                }); 

                var check_in_date = $('input[name="arrive"]').val();
                check_in_date = homey_convert_date(check_in_date);

                var check_out_date = $('input[name="depart"]').val();
                check_out_date = homey_convert_date(check_out_date);

                var guests = $('input[name="guests"]').val();
                var listing_id = $('#listing_id').val();
                var security = $('#reservation-security').val();
                homey_calculate_booking_cost(check_in_date, check_out_date, guests, listing_id, security, extra_options);

            });
                
            
            
        }

        if(homey_booking_type == 'per_hour') {
            
            $('.hourly-js-desktop ul li').on('click', function () {
                var $this = $(this);
                var vl = $this.data('formatted-date');
                $('input[name="arrive"]').val(vl);

                $('.single-listing-hourly-calendar-wrap ul li').removeClass('selected');
                $this.addClass('selected');

                $('#single-booking-search-calendar, #single-overlay-booking-search-calendar').hide();

                var check_in_date = $('input[name="arrive"]').val();
                check_in_date = homey_convert_date(check_in_date);

                var start_hour = $('select[name="start_hour"]').val();
                var end_hour = $('select[name="end_hour"]').val();
                var guests = $('input[name="guests"]').val();
                var listing_id = $('#listing_id').val();
                var security = $('#reservation-security').val();
                homey_calculate_hourly_booking_cost(check_in_date, start_hour, end_hour, guests, listing_id, security);

                if(check_in_date === '' || start_hour === '' || end_hour === '')
                    return;
                check_booking_availability_on_hour_change(check_in_date, start_hour, end_hour, listing_id, security);
            });

            $('#start_hour').on('change', function () {
                var check_in_date = $('input[name="arrive"]').val();
                check_in_date = homey_convert_date(check_in_date);

                var start_hour = $('select[name="start_hour"]').val();
                var end_hour = $('select[name="end_hour"]').val();
                var guests = $('input[name="guests"]').val();
                var listing_id = $('#listing_id').val();
                var security = $('#reservation-security').val();
                homey_calculate_hourly_booking_cost(check_in_date, start_hour, end_hour, guests, listing_id, security);

                if(check_in_date === '' || start_hour === '' || end_hour === '')
                    return;
                check_booking_availability_on_hour_change(check_in_date, start_hour, end_hour, listing_id, security);
            });

            $('#end_hour').on('change', function () {
                var check_in_date = $('input[name="arrive"]').val();
                check_in_date = homey_convert_date(check_in_date);

                var start_hour = $('select[name="start_hour"]').val(); 
                var end_hour = $('select[name="end_hour"]').val();
                var guests = $('input[name="guests"]').val();
                var listing_id = $('#listing_id').val();
                var security = $('#reservation-security').val();
                homey_calculate_hourly_booking_cost(check_in_date, start_hour, end_hour, guests, listing_id, security);
                check_booking_availability_on_hour_change(check_in_date, start_hour, end_hour, listing_id, security);
            });

            $('.hourly-js-mobile ul li').on('click', function () {
                var $this = $(this);
                var vl = $this.data('formatted-date');
                $('input[name="arrive"]').val(vl);

                $('.single-listing-hourly-calendar-wrap ul li').removeClass('selected');
                $this.addClass('selected');

                $('#single-booking-search-calendar, #single-overlay-booking-search-calendar').hide();

                var check_in_date = $('input[name="arrive"]').val();
                check_in_date = homey_convert_date(check_in_date);

                var start_hour = $('#start_hour_overlay').val();
                var end_hour = $('#end_hour_overlay').val();
                var guests = $('input[name="guests"]').val();
                var listing_id = $('#listing_id').val();
                var security = $('#reservation-security').val();
                homey_calculate_hourly_booking_cost(check_in_date, start_hour, end_hour, guests, listing_id, security);

                if(check_in_date === '' || start_hour === '' || end_hour === '')
                    return;
                check_booking_availability_on_hour_change(check_in_date, start_hour, end_hour, listing_id, security);
            });

            $('#start_hour_overlay').on('change', function () {
                var check_in_date = $('input[name="arrive"]').val();
                check_in_date = homey_convert_date(check_in_date);

                var start_hour = $('#start_hour_overlay').val();
                var end_hour = $('#end_hour_overlay').val();
                var guests = $('input[name="guests"]').val();
                var listing_id = $('#listing_id').val();
                var security = $('#reservation-security').val();
                homey_calculate_hourly_booking_cost(check_in_date, start_hour, end_hour, guests, listing_id, security);

                if(check_in_date === '' || start_hour === '' || end_hour === '')
                    return;
                check_booking_availability_on_hour_change(check_in_date, start_hour, end_hour, listing_id, security);
            });

            $('#end_hour_overlay').on('change', function () {
                var check_in_date = $('input[name="arrive"]').val();
                check_in_date = homey_convert_date(check_in_date);

                var start_hour = $('#start_hour_overlay').val(); 
                var end_hour = $('#end_hour_overlay').val();
                var guests = $('input[name="guests"]').val();
                var listing_id = $('#listing_id').val();
                var security = $('#reservation-security').val();
                homey_calculate_hourly_booking_cost(check_in_date, start_hour, end_hour, guests, listing_id, security);
                check_booking_availability_on_hour_change(check_in_date, start_hour, end_hour, listing_id, security);
            });

            $('.apply_guests').on('click', function () {
                var check_in_date = $('input[name="arrive"]').val();
                check_in_date = homey_convert_date(check_in_date);

                var start_hour = $('select[name="start_hour"]').val();
                var end_hour = $('select[name="end_hour"]').val();
                var guests = $('input[name="guests"]').val();
                var listing_id = $('#listing_id').val();
                var security = $('#reservation-security').val();
                homey_calculate_hourly_booking_cost(check_in_date, start_hour, end_hour, guests, listing_id, security);
                check_booking_availability_on_hour_change(check_in_date, start_hour, end_hour, listing_id, security);
            });

            $('#apply_guests_hourly').on('click', function () {
                var check_in_date = $('input[name="arrive"]').val();
                check_in_date = homey_convert_date(check_in_date);

                var start_hour = $('#start_hour_overlay').val(); 
                var end_hour = $('#end_hour_overlay').val();
                var guests = $('input[name="guests"]').val();
                var listing_id = $('#listing_id').val();
                var security = $('#reservation-security').val();
                homey_calculate_hourly_booking_cost(check_in_date, start_hour, end_hour, guests, listing_id, security);
                check_booking_availability_on_hour_change(check_in_date, start_hour, end_hour, listing_id, security);
            });


            $('.homey_extra_price input').on('click', function(){
                var extra_options = []; var temp_opt;

                $('.homey_extra_price input').each(function() {

                    if( ($(this).is(":checked")) ) {
                        var extra_name = $(this).data('name');
                        var extra_price = $(this).data('price');
                        var extra_type = $(this).data('type');
                        temp_opt    =   '';
                        temp_opt    =   extra_name;
                        temp_opt    =   temp_opt + '|' + extra_price;
                        temp_opt    =   temp_opt + '|' + extra_type;
                        extra_options.push(temp_opt);
                    }
                    
                }); 

                var check_in_date = $('input[name="arrive"]').val();
                check_in_date = homey_convert_date(check_in_date);

                var start_hour = $('select[name="start_hour"]').val(); 
                var end_hour = $('select[name="end_hour"]').val();

                var guests = $('input[name="guests"]').val();
                var listing_id = $('#listing_id').val();
                var security = $('#reservation-security').val();
                homey_calculate_hourly_booking_cost(check_in_date, start_hour, end_hour, guests, listing_id, security, extra_options);

            });

        }

        /* ------------------------------------------------------------------------ */
        /*  Guests count
        /* ------------------------------------------------------------------------ */

        var single_listing_guests = function() {

            $('.adult_plus').on('click', function(e) {
                e.preventDefault();
                var guests = parseInt($('input[name="guests"]').val()) || 0;
                var adult_guest = parseInt($('input[name="adult_guest"]').val());
                var child_guest = parseInt($('input[name="child_guest"]').val());

                adult_guest++;
                $('.homey_adult').text(adult_guest);
                $('input[name="adult_guest"]').val(adult_guest);

                var total_guests = adult_guest + child_guest;

                if( (allow_additional_guests != 'yes') && (total_guests == allowed_guests_num)) {
                    $('.adult_plus').attr("disabled", true);
                    $('.child_plus').attr("disabled", true);

                } else if( (allow_additional_guests == 'yes') && (total_guests == allowed_guests_plus_additional) ) {
                    if(num_additional_guests !== '') {
                        $('.adult_plus').attr("disabled", true);
                        $('.child_plus').attr("disabled", true);
                    }
                }

                $('input[name="guests"]').val(total_guests);
            });

            $('.adult_minus').on('click', function(e) {
                e.preventDefault();
                var guests = parseInt($('input[name="guests"]').val()) || 0;
                var adult_guest = parseInt($('input[name="adult_guest"]').val());
                var child_guest = parseInt($('input[name="child_guest"]').val());
                
                if (adult_guest == 0) return;
                adult_guest--;
                $('.homey_adult').text(adult_guest);
                $('input[name="adult_guest"]').val(adult_guest);

                var total_guests = adult_guest + child_guest;
                $('input[name="guests"]').val(total_guests);

                $('.adult_plus').removeAttr("disabled");
                $('.child_plus').removeAttr("disabled");
            });

            $('.child_plus').on('click', function(e) {
                e.preventDefault();
                var guests = parseInt($('input[name="guests"]').val());
                var child_guest = parseInt($('input[name="child_guest"]').val());
                var adult_guest = parseInt($('input[name="adult_guest"]').val());

                child_guest++;
                $('.homey_child').text(child_guest);
                $('input[name="child_guest"]').val(child_guest);

                var total_guests = child_guest + adult_guest;

                if( (allow_additional_guests != 'yes') && (total_guests == allowed_guests_num)) {
                    $('.adult_plus').attr("disabled", true);
                    $('.child_plus').attr("disabled", true);

                } else if( (allow_additional_guests == 'yes') && (total_guests == allowed_guests_plus_additional) ) {
                    if(num_additional_guests !== '') {
                        $('.adult_plus').attr("disabled", true);
                        $('.child_plus').attr("disabled", true);
                    }
                }

                $('input[name="guests"]').val(total_guests);

            });

            $('.child_minus').on('click', function(e) {
                e.preventDefault();
                var guests = parseInt($('input[name="guests"]').val());
                var child_guest = parseInt($('input[name="child_guest"]').val());
                var adult_guest = parseInt($('input[name="adult_guest"]').val());

                if (child_guest == 0) return;
                child_guest--;
                $('.homey_child').text(child_guest);
                $('input[name="child_guest"]').val(child_guest);

                var total_guests = child_guest + adult_guest;

                $('input[name="guests"]').val(total_guests);

                $('.adult_plus').removeAttr("disabled");
                $('.child_plus').removeAttr("disabled");

            });
        }
        single_listing_guests();


         /* ------------------------------------------------------------------------ */
        /* Per Hour availability calendar
        /* ------------------------------------------------------------------------ */
        var homey_hourly_availability_calendar = function(){
            var  today = new Date();
            var listing_booked_dates=[];
            var listing_pending_dates=[];

            for (var key in booked_hours_array) {
                if (booked_hours_array.hasOwnProperty(key) && key!=='') { 
                    var temp_book=[];
                    temp_book['title']     =   HOMEY_ajax_vars.hc_reserved_label,
                    temp_book ['start']    =   moment.unix(key).utc().format(),
                    temp_book ['end']      =   moment.unix( booked_hours_array[key]).utc().format(),
                    temp_book ['editable'] =   false;
                    temp_book ['color'] =   '#fdd2d2';
                    temp_book ['textColor'] =   '#444444';
                    listing_booked_dates.push(temp_book);
                }
            }

            for (var key_pending in pending_hours_array) {
                if (pending_hours_array.hasOwnProperty(key_pending) && key_pending!=='') { 
                    var temp_pending=[];
                    temp_pending['title']     =   HOMEY_ajax_vars.hc_pending_label,
                    temp_pending ['start']    =   moment.unix(key_pending).utc().format(),
                    temp_pending ['end']      =   moment.unix( pending_hours_array[key_pending]).utc().format(),
                    temp_pending ['editable'] =   false;
                    temp_pending ['color']    =   '#ffeedb';
                    temp_pending ['textColor'] =   '#333333';
                    listing_pending_dates.push(temp_pending);
                }
            }

            var hours_slot = $.merge(listing_booked_dates, listing_pending_dates);
            var calendarEl = document.getElementById('homey_hourly_calendar');

            var calendar = new FullCalendar.Calendar(calendarEl, {
                locale: HOMEY_ajax_vars.homey_current_lang,
                timeZone: HOMEY_ajax_vars.homey_timezone,
                plugins: [ 'timeGrid' ],
                defaultView: 'timeGridWeek',
                slotDuration:'00:30:00',
                minTime: booking_start_hour,
                maxTime: booking_end_hour,
                events: hours_slot,
                defaultDate: today,   
                selectHelper: true,
                selectOverlap : false,
                footer: false,
                nowIndicator: true,
                allDayText: HOMEY_ajax_vars.hc_hours_label,
                weekNumbers: false,
                weekNumbersWithinDays: true,
                weekNumberCalculation: 'ISO',
                editable: false,
                eventLimit: true,
                unselectAuto: false,
                isRTL: homey_is_rtl,
                buttonText: {
                  today:    HOMEY_ajax_vars.hc_today_label
                }
            });

            calendar.render();
        }

        if(homey_booking_type == 'per_hour' && is_listing_detail == 'yes') {
            if( $('#homey_hourly_calendar').length > 0 ) {
                homey_hourly_availability_calendar();
            }
        }


        $('#make_booking_payment').on('click', function(e){
            e.preventDefault();

            var $this = $(this);
            var reservation_id = $('#reservation_id').val();
            var security = $('#checkout-security').val();

            var payment_gateway = $("input[name='payment_gateway']:checked").val();
            if(payment_gateway == undefined ) {
                $('#homey_notify').html('<div class="alert alert-danger alert-dismissible" role="alert">'+choose_gateway_text+'</div>');
            }
            
            if(payment_gateway === 'paypal') {
                homey_booking_paypal_payment($this, reservation_id, security);

            } else if(payment_gateway === 'stripe') {
                var hform = $(this).parents('.dashboard-area');
                hform.find('.homey_stripe_simple button').trigger("click");
                $('#homey_notify').html('');
            }
            return;
        });

        $('#make_hourly_booking_payment').on('click', function(e){
            e.preventDefault();

            var $this = $(this);
            var reservation_id = $('#reservation_id').val();
            var security = $('#checkout-security').val();

            var payment_gateway = $("input[name='payment_gateway']:checked").val();
            if(payment_gateway == undefined ) {
                $('#homey_notify').html('<div class="alert alert-danger alert-dismissible" role="alert">'+choose_gateway_text+'</div>');
            }
            
            if(payment_gateway === 'paypal') {
                homey_hourly_booking_paypal_payment($this, reservation_id, security);

            } else if(payment_gateway === 'stripe') {
                var hform = $(this).parents('.dashboard-area');
                hform.find('.homey_stripe_simple button').trigger("click");
                $('#homey_notify').html('');
            }
            return;

        });


        $('#make_instance_booking_payment').on('click', function(e){
            e.preventDefault();

            var $this = $(this);
            var check_in   = $('#check_in_date').val();
            //check_in = homey_convert_date(check_in);

            var check_out  = $('#check_out_date').val();
            //check_out = homey_convert_date(check_out);

            var guests     = $('#guests').val();
            var listing_id = $('#listing_id').val();
            var renter_message = $('#renter_message').val();
            var security   = $('#checkout-security').val();

            var extra_options = [];
            var temp_opt;
            $('.homey_extra_price').each(function() {
                var extra_name = $(this).data('name');
                var extra_price = $(this).data('price');
                var extra_type = $(this).data('type');
                temp_opt    =   '';
                temp_opt    =   extra_name;
                temp_opt    =   temp_opt + '|' + extra_price;
                temp_opt    =   temp_opt + '|' + extra_type;
                extra_options.push(temp_opt);   
            });

            $('#instance_noti').empty();

            var payment_gateway = $("input[name='payment_gateway']:checked").val();
            if(payment_gateway == undefined ) {
                $('#instance_noti').html('<div class="alert alert-danger alert-dismissible" role="alert">'+choose_gateway_text+'</div>');
            }
            
            if(payment_gateway === 'paypal') {
                homey_instance_booking_paypal_payment($this, check_in, check_out, guests, extra_options, listing_id, renter_message, security);

            } else if(payment_gateway === 'stripe') {
                var hform = $(this).parents('form');
                hform.find('.homey_stripe_simple button').trigger("click");

            }
            return;
        });

        $('#make_hourly_instance_booking_payment').on('click', function(e){ 
            e.preventDefault();

            var $this = $(this);
            var check_in   = $('#check_in_date').val();

            var check_in_hour  = $('#check_in_hour').val();
            var check_out_hour  = $('#check_out_hour').val();
            var start_hour  = $('#start_hour').val();
            var end_hour  = $('#end_hour').val();
            var guests     = $('#guests').val();
            var listing_id = $('#listing_id').val();
            var renter_message = $('#renter_message').val();
            var security   = $('#checkout-security').val();

            var extra_options = [];
            var temp_opt;
            $('.homey_extra_price').each(function() {
                var extra_name = $(this).data('name');
                var extra_price = $(this).data('price');
                var extra_type = $(this).data('type');
                temp_opt    =   '';
                temp_opt    =   extra_name;
                temp_opt    =   temp_opt + '|' + extra_price;
                temp_opt    =   temp_opt + '|' + extra_type;
                extra_options.push(temp_opt);   
            });

            $('#instance_noti').empty();

            var payment_gateway = $("input[name='payment_gateway']:checked").val();
            if(payment_gateway == undefined ) {
                $('#instance_noti').html('<div class="alert alert-danger alert-dismissible" role="alert">'+choose_gateway_text+'</div>');
            }
            
            if(payment_gateway === 'paypal') {
                homey_hourly_instance_booking_paypal_payment($this, check_in, check_in_hour, check_out_hour, start_hour, end_hour, guests, extra_options, listing_id, renter_message, security);

            } else if(payment_gateway === 'stripe') {
                var hform = $(this).parents('form');
                hform.find('.homey_stripe_simple button').trigger("click");

            }
            return;

        });


        $('button.homey-booking-step-2').on('click', function(e){
            e.preventDefault();

            var agreement = $("input[name='agreement']:checked").val();

            $('.homey-booking-block-body-2 .continue-block-button p.error').remove();

            if(agreement != undefined) {

                $('.homey-booking-block-title-3').removeClass('inactive mb-0');
                $('.homey-booking-block-body-3').slideDown('slow');

                $('.homey-booking-block-title-2').addClass('mb-0');
                $('.homey-booking-block-body-2').slideUp('slow');
                $('.homey-booking-block-title-2 .text-success, .homey-booking-block-title-2 .edit-booking-form').removeClass('hidden');
                $('.homey-booking-block-title-2 .text-success, .homey-booking-block-title-2 .edit-booking-form').show();
            } else {
                $('.homey-booking-block-body-2 .continue-block-button').prepend('<p class="error text-danger"><i class="fa fa-close"></i> '+ agree_term_text +'</p>');
            }

        });

        $('.homey-booking-block-title-1 .edit-booking-form').on('click', function(e){
            e.preventDefault();

            $('.homey-booking-block-title-2, .homey-booking-block-title-3').addClass('mb-0');
            $('.homey-booking-block-body-2, .homey-booking-block-body-3').slideUp('slow');

            $('.homey-booking-block-title-1').removeClass('mb-0');
            $('.homey-booking-block-body-1').slideDown('slow');

        });

        $('.homey-booking-block-title-2 .edit-booking-form').on('click', function(e){
            e.preventDefault();

            $('.homey-booking-block-title-1, .homey-booking-block-title-3').addClass('mb-0');
            $('.homey-booking-block-body-1, .homey-booking-block-body-3').slideUp('slow');

            $('.homey-booking-block-title-2').removeClass('mb-0');
            $('.homey-booking-block-body-2').slideDown('slow');

        });

        /* ------------------------------------------------------------------------ */
        /*  Homey login and regsiter
         /* ------------------------------------------------------------------------ */
        $('.homey_login_button').on('click', function(e){
            e.preventDefault();
            var current = $(this);
            homey_login( current );
        });

        $('.homey-register-button').on('click', function(e){
            e.preventDefault();
            var current = $(this);
            homey_register( current );
        });


        /*--------------------------------------------------------------------------
         *   Facebook login
         * -------------------------------------------------------------------------*/
        $('.homey-facebook-login').on('click', function() {
            var current = $(this);
        });

        /*--------------------------------------------------------------------------
         *  Social Logins
         * -------------------------------------------------------------------------*/
        $('.homey-yahoo-login').on('click', function () {
            var current = $(this);
        });
        $('.homey-google-login').on('click', function () {
            var current = $(this);
        });



        $( document ).ready(function() {
            if( parseInt( userID, 10 ) != 0 ) {
                setInterval(function() { homey_message_notifications(); }, 60000);
            }
        });


        $('.btn_extra_expense').on('click', function(e) {
            e.preventDefault(); 
            var reservation_id = $('#resrv_id').val();

        });



    }// typeof HOMEY_ajax_vars

}); // end document ready