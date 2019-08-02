(function($){
    "use strict";

    // Source : http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript#answer-2866613
    Number.prototype.toMoney = function(decimals, decimal_sep, thousands_sep) {
       var n = this,
       c = isNaN(decimals) ? 2 : Math.abs(decimals),
       d = decimal_sep || '.',
       t = (typeof thousands_sep === 'undefined') ? '.' : thousands_sep,
       sign = (n < 0) ? '-' : '',
       i = parseInt(n = Math.abs(n).toFixed(c)) + '',
       j = ((j = i.length) > 3) ? j % 3 : 0;
       return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
    };

    window.MAIN = {

        // Handling views with bxSlider
        manager : $('.z_question_views').bxSlider({
            infiniteLoop : false,
            slideSelector : $('.z_view'),
            mode : 'fade',
            speed : 0,
            adaptiveHeight : true,
            adaptiveHeightSpeed : 0,
            startSlide : 0,
            touchEnabled : false,
            pager : false,
            controls : false,
            onSlideAfter: function (item, oldIndex, newIndex) {
                // return;
                // console.log('onSlideAfter', newIndex);

                switch (newIndex) {
                    case 0:
                        break;
                    case 1:
                        MAIN.tracking('Step 1: Lyd og billede');
                        break;
                    case 2:
                        MAIN.tracking('Step 2: It og tilbehør');
                        break;
                    case 3:
                        MAIN.tracking('Step 3: Madlavning');
                        break;
                    case 4:
                        MAIN.tracking('Step 4: Belysning');
                        break;
                    case 5:
                        MAIN.tracking('Step 5: Vask');
                        break;
                    case 6:
                        MAIN.tracking('Step 6: Småapparater');
                        break;
                    case 7:
                        MAIN.tracking('Step 7: Resultatside');
                        break;
                }
            }
        }),

        $cta_footer : $('.z_view_ctas'),
        $view : $('.z_view'),

        // Tracking base
        tracking_base: 'beregner/standby/',

        // API base url
        apiBase: 'https://api.de-dynamisk.dk/api',

        result_arr : [
            {
                title : "Lyd og billede",
                result : 0
            },
            {
                title : "It og tilbehør",
                result : 0
            },
            {
                title : "Madlavning",
                result : 0
            },
            {
                title : "Belysning",
                result : 0
            },
            {
                title : "Vask",
                result : 0
            },
            {
                title : "Småapparater",
                result : 0
            }
        ],

        // Initialize
        init: function () {
            this.misc();
            this.change_view();
            this.build_views();
            // Disable native autocompletes
            this.disableNativeAutocomplete();
            this.preloader();
            this.animate_standbybtn();
            this.start_test();
            this.handle_answers();
            this.simple_accordion();
            this.handleNewsletter();
            this.handleAutoComplete();
            this.simple_modal();
            // New custom tooltips
            this.formHelp();
            // Terms popover element
            this.popover();
            // Handle theme background image
            this.imageTheme();
            // Handle arrow links
            this.linkArrow();

            MAIN.tracking('Start');
        },

        simple_modal : function() {

            $('.question-help-trigger').hammer().on('tap', function() {
                var content = $(this).parent().find('.question-help-content');
                if( content.hasClass('_open') ) {
                    content.removeClass('_open');
                } else {
                    content.addClass('_open');
                }
            });

        },
        

        // Handle tracking
        tracking: function (path) {
            // Is path an array?
            if ($.isArray(path)) {
                path = path.join('/');
            }

            // Track
            if (typeof $netminers !== 'undefined') {
                $netminers.push(
                    ['postPageView', MAIN.tracking_base + path]
                );
            }

            // Google analytics?
            if (typeof ga !== 'undefined') {
                ga('send', 'pageview', MAIN.tracking_base + path);
            }
        },

        misc : function() {

            $('input[data-type="numeric"]').hammer().on('keydown', function(e) {

                var k = e.keyCode;
                if( k == 8 || k == 9 || k == 13 || k == 35 || k == 36 || k == 37 || k == 39 || (k > 45 && k < 58) || (k > 95 && k < 106)){
                    return true;
                } else {
                    e.stopPropagation
                    e.preventDefault();
                    return false;
                }

            });

            // Fixes extra input cursor mysteriously appearing when clicking on the red border
            $('.mandatory').hammer().on('tap', function(e){
                e.preventDefault();
            });
        },

        simple_accordion : function() {

            $('.z_acc_trigger').hammer().on('tap', function() {
                var parent = $(this).closest('.z_acc_wrap');
                if( parent.hasClass('_open') ) {
                    parent.removeClass('_open');
                    //var viewport_height = $('.bx-viewport').innerHeight();
                    //$('.bx-viewport').height( viewport_height - 60 );
                } else {
                    parent.addClass('_open');
                    //var viewport_height = $('.bx-viewport').innerHeight();
                    //$('.bx-viewport').height( viewport_height + 60 );
                }
            });

        },

        set_result : function() {

            var calc_cost = 0;

            for( var i = 0; i < MAIN.result_arr.length; i++ ) {
                calc_cost += MAIN.result_arr[i].result;
                var $result = $('[data-res="'+ i +'"]'),
                    $text = $result.find('._text'),
                    $price = $result.find('._price'),
                    $image = $result.find('[class*="theme-image"]'),
                    $image_path = 'assets/img/res_'+(i+1)+'.png';

                $text.text( MAIN.result_arr[i].title + ' ' );
                $price.text( (MAIN.result_arr[i].result).toMoney(0) + ' kr.' );

                if (!$image.attr('data-image')) {
                    $image.attr('data-image', $image_path);
                    $image.find('[class*="background"]').css({
                        'background-image': 'url('+$image_path+')'
                    });
                }
            }
            $('.z_the_result').text('0');

            var Counter = { val : 0 };
            TweenMax.to( Counter, 1, {
                val : "+="+calc_cost,
                delay : 1.1,
                onUpdate : function() {
                    var val = Math.floor(Counter.val);
                    $('.z_the_result').text( val.toMoney(0) );
                }
            });

            var exp_data = {};

            for( var key in MAIN.result_arr ) {
                exp_data[MAIN.result_arr[key].title] = MAIN.result_arr[key].result;
            }

            // Send request
            $.ajax({
                type: 'POST',
                data: JSON.stringify( exp_data ),
                contentType: 'text/plain',
                processData: false,
                xhrFields: { withCredentials: true },
                url: MAIN.apiBase + '/calculator/4',
                always : function(data) {

                },
                success: function (data) {

                },
                error: function (err) {
                }
            });

        },

        start_test : function() {

            $('#z_start').hammer().on('tap', function() {
                // Go to first step
                MAIN.manager.goToNextSlide();

                // Tracking
                // MAIN.tracking( 'Start' );

                TweenMax.to( $('.z_view_ctas'), .2, {
                    autoAlpha : 1,
                    maxHeight : 10000
                });
            });
        },

        // Handle autocomplete
        handleAutoComplete: function () {
            // Find autocomplete
            var $input = $('input[data-type="autocomplete"]');

            // Setup autocomplete
            $input.autocomplete({
                serviceUrl: 'https://dawa.aws.dk/adresser/autocomplete',
                minChars: 3,
                maxHeight: 300,
                paramName: 'q',
                dataType: 'json',
                formatResult: function(suggestion, currentValue) {
                    return suggestion.value;
                },
                transformResult: function(response) {
                    // Return modified suggestions
                    return {
                        suggestions: $.map(response, function(item) {
                            return { value: item.tekst, data: item.adresse };
                        })
                    };
                },
                onSelect: function (suggestion) {
                    // // Build address-string
                    // var address = [
                    //     suggestion.data.vejnavn,
                    //     suggestion.data.husnr,
                    //     suggestion.data.etage,
                    //     suggestion.data['dør'],
                    // ].join(' ');

                    // // Trim
                    // address = $.trim(address);

                    // // Set address
                    // $('input[name="address"]').val(address);

                    // // Set postal
                    // $('input[name="zip"]').val(suggestion.data.postnr);

                    // // Set city
                    // $('input[name="city"]').val(suggestion.data.postnrnavn);
                }
            });
        },

        // Handle required fields
        required: function (index) {
            // Get required fields
            var $required;

            // Make sure to blur active element
            $(':focus').blur();

            // Index provided?
            if (index) {
                // Get active page
                $required = $('.page').slice(0, index).find('.mandatory');
            } else {
                $required = $('.page').find('.mandatory:visible');
            }

            // Any mandatory fields not filled out?
            var not_filled = false; $required.each(function(){
                // Get input
                var $input = $(this).find('input,select,textarea').eq(0);

                // Check if it has been filled
                var value = $input.val();

                // Handle radiobutton
                if ($input.is('[type="radio"]') || $input.is('[type="checkbox"]')) {
                    if ($('[name="' + $input.attr('name') + '"]:checked').length === 0) {
                        value = '';
                    }
                }

                if (value === '') {
                    // First input?
                    if (not_filled === false) {
                        $input.focus();
                    }

                    // Set filled status
                    not_filled = true;

                    // Show error
                    if ($(this).closest('.form-group').find('.error-text,.radio-error-text').length) {
                        $(this).closest('.form-group').removeClass('has-danger').find('.error-text,.radio-error-text').remove();
                    }

                    // Append error-message
                    $('<div/>')
                        .addClass(($input.is('[type="radio"]') || $input.is('[type="checkbox"]')) ? 'radio-error-text' : 'error-text')
                        .html(($(this).data('error')) ? $(this).data('error') : 'Dette felt skal udfyldes')
                        .appendTo($(this).closest('.form-group'));

                    if ($(this).find('input').length &&
                        !$(this).find('input').is('[type="radio"]') &&
                        !$(this).find('input').is('[type="checkbox"]')) {
                        $(this).closest('.form-group').addClass('has-danger')
                    }

                    // Highlight
                    $(this).one('change focus focusin keydown', function() {
                        $(this).closest('.form-group').removeClass('has-danger').find('.error-text,.radio-error-text').remove();
                    });
                }
            });

            // Make sure theres no visible errors showing
            if ($('.error-text:visible').length) {
                not_filled = true;
            }

            // Return true if all mandatory fields has been filled
            if (!not_filled) return true;

            return false;
        },

        change_view : function() {

            // Buttons
            var $nxt = MAIN.$cta_footer.find('._nxt'),
                $nxt_text = $nxt.text(),
                $prev = MAIN.$cta_footer.find('._prev'),
                $first = $('._first');

            // Next handler
            $nxt.hammer().on('tap', function() {
                var $cur_view_index = MAIN.manager.getCurrentSlide();
                var $cur_view = $('.z_view').eq( parseInt( $cur_view_index ) );
                var $questions_wrap = $cur_view.find('.z_questions');

                $questions_wrap.find('.z_radiobtn_bar_wrap').each(function() {
                    var $btn_wrap = $(this).find('.z_radiobtn_bar');
                    if( $btn_wrap.find('.active').length === 0 ) {
                        $btn_wrap.parent().addClass('error');
                    } else {
                        $btn_wrap.parent().addClass('valid');
                    }
                });

                var valid_rows = $questions_wrap.find('.z_radiobtn_bar_wrap.valid').length;
                var num_of_rows = $questions_wrap.find('.z_radiobtn_bar_wrap').length;

                // If valid
                if( valid_rows === num_of_rows ) {

                    var obj_index = MAIN.manager.getCurrentSlide() - 1;
                    var result = $cur_view.find('.z_calc_saved').data('sum');

                    // MAIN.tracking( 'Step ' + (obj_index + 1) + ': ' + MAIN.result_arr[ obj_index ].title );

                    // Collect the answers when going to next slide
                    MAIN.result_arr[ obj_index ].result = result;

                    // Next question slide
                    MAIN.manager.goToNextSlide();

                    // Scroll to top of page
                    TweenMax.to( window, .3, {
                      scrollTo : {
                          y : 0
                      },
                      delay : .4
                    });

                    // Change _nxt button text on last question page
                    if( $cur_view_index === 5 ) {
                        $nxt.text('Se resultat');
                    } else {
                        $nxt.text($nxt_text);
                    }

                    // Hide footer if we're going to result page
                    if( $cur_view_index === 6 ) {
                        TweenMax.to( $('.z_view_ctas'), 0, {
                            autoAlpha : 0,
                            maxHeight : 0
                        });
                        // Set result
                        MAIN.set_result();

                        $('.z_view_ctas').addClass('no-padding');
                    }
                    
                    // Scroll to top
                    if ('parentIFrame' in window) {
                        // Send scroll event
                        parentIFrame.sendMessage('scrollToIframe');
                    } else {
                        $(window).scrollTop(0);
                    }

                } else { // validation error, scroll to first row with error

                    var first_invalid_offset_top = Math.floor( $questions_wrap.find('.z_radiobtn_bar_wrap.error').eq(0).offset().top );
                    TweenMax.to( window, .3, {
                      scrollTo : {
                          y : first_invalid_offset_top - 20
                      },
                      delay : .4
                    });
                }

            });

            $prev.hammer().on('tap', function() {
                var $cur_view_index = MAIN.manager.getCurrentSlide();
                if( $cur_view_index === 1 ) {
                    TweenMax.to( $('.z_view_ctas'), 0, {
                        autoAlpha : 0,
                        maxHeight : 0
                    });
                }

                // Set _nxt button initial text
                $nxt.text($nxt_text);
                
                MAIN.manager.goToPrevSlide();

                TweenMax.to( window, .3, {
                  scrollTo : {
                      y : 0
                  },
                  delay : .4
                });

            });

            $first.hammer().on('tap', function() {
                $('[data-res]').find('._price').text('0 kr.');
                $('.z_the_result').text('0');
                
                MAIN.manager.goToSlide(1);

                TweenMax.to( $('.z_view_ctas'), 0, {
                    autoAlpha : 1,
                    maxHeight : 10000
                });

                $('.z_view_ctas').removeClass('no-padding');

                // Scroll to top of page
                TweenMax.to( window, .3, {
                    scrollTo : {
                        y : 0
                    },
                    delay : .4
                });
            });

        },

        handle_answers : function() {

            $('.z_lbl').hammer().on('tap', function() {
                var $bar_wrap = $(this).closest('.z_radiobtn_bar'),
                    cost_per_year = $bar_wrap.data('value'),
                    $row_res = $bar_wrap.closest('.z_radiobtn_bar_wrap').find('.z_calc_row'),
                    multiplier = parseInt( $(this).data('val') ),
                    total = 0;

                $bar_wrap.removeClass('error');
                $bar_wrap.parent().removeClass('error');

                // Make clicked option active
                $bar_wrap.find('.z_radiobtn').removeClass('active');
                $(this).parent().addClass('active');

                var t_sum = parseInt( (cost_per_year * multiplier) ) ;

                // Insert calculated price at the end of the row
                $row_res.html( '<span class="z_value">' + ( cost_per_year * multiplier ).toMoney(0) + '</span><span> kr.</span>' );
                $row_res.data('cost', ( cost_per_year * multiplier ) );

                // Calculate total
                var $this_view = MAIN.$view.eq( MAIN.manager.getCurrentSlide() );

                    $this_view.find('.z_calc_row').each(function() {
                        var this_val = parseInt( $(this).data('cost') );
                        var val = isNaN( this_val ) ? 0 : this_val;
                        total += val;
                    });

                // Write the total to this view's footer
                $this_view.find('.z_calc_saved').text( total.toMoney(0) ).data('sum', total );

            });

        },

        animate_standbybtn : function() {

            var tl = new TimelineMax({
                delay : 2,
                onComplete : function() {
                }
            }),elem = $('.z_LED_on');

            tl.to( elem, 1.1, {
                ease : Sine.ease,
                autoAlpha : 1
            }).to( elem, .9, {
                delay : .4,
                ease : Sine.ease,
                autoAlpha : 0,
                maxHeight : 400
            });

        },

        preloader : function() {

            TweenMax.to( $('.z_preloader_wrap'), .2, {
                autoAlpha : 0,
                delay : .1,
                onComplete : function() {
                    this.target.remove();
                }
            });

            var ctx = $("#z_load_circle").get(0).getContext('2d');
            var data = [
                {
                    value: 100,
                    color:"#ccc"
                }
            ];
            var options = {
                segmentShowStroke : false,
                percentageInnerCutout : 86,
                animationSteps : 40,
                animationEasing : "easeOutQuart",
                animateRotate : true,
                animateScale : false,
                // Oncomplete function
                onAnimationComplete : function() {


                    // var Counter = { val : 0 };
                    // TweenMax.to( Counter, 1, {
                    //   val : "+="+100,
                    //   onUpdate : function() {
                    //     $('.z_stats_percentage').text( Math.floor(Counter.val) );
                    //   }
                    // });
                }
            };
            //var myDoughnutChart = new Chart(ctx).Doughnut(data,options);
        },


        // Populates the views with content
        // --------------------------------------------------------------------------------
        // --------------------------------------------------------------------------------
        build_views : function() {

            for( var i = 0; i < z_DATA.length; i++ ) {

                var $view = $('.z_view').eq( i + 1 ),
                    $q_wrap = $view.find('.z_questions'),
                    $header = $view.find('.z_view_header'),
                    $q_header = $view.find('.z_question_header'),
                    $view_footer = $view.find('.z_cta_footer'),
                    $step_head = $header.find('.step-head'),
                    $header_image = $step_head.find('.theme-image-circle'),
                    $header_content = $step_head.find('.theme-content');

                if( z_DATA[i].sub_header != '' ) {
                    var $sub_header = $('<p class="z_step_subh">'+ z_DATA[i].sub_header +'</p>');

                    $header_content.append($sub_header);
                }

                if( z_DATA[i].acc_title != '' ) {
                    var $z_acc = $('<div class="z_acc_wrap">'+ 
                                     '<span class="z_acc_trigger">'+ z_DATA[i].acc_title +'</span>'+
                                     '<div class="z_acc_content">'+
                                       '<p>'+ z_DATA[i].acc_body +'</p>'+
                                     '</div>'+
                                   '</div>');

                    $header_content.append($z_acc);
                }

                // Populate header
                $header.find('.z_view_title').text( z_DATA[i].title );
                $header.find('.z_step_txt').text( '('+ ( i + 1 ) +' af 6)' );
                $header.find('.z_step_subh').text( z_DATA[i].sub_header );

                $q_header.find('.z_header_txt').html( '<h2 class="_thin">'+z_DATA[i].question+'</h2>' );
                $header_image.attr('data-image', 'assets/img/'+(i+1)+'.png');

                if (!$header_image.attr('data-position')) {
                    $header_image.attr('data-position', 'center');
                }

                // Populate footer
                $view_footer.find('.z_yearly_cost_desc').html('<h2 class="_strong">Samlet standby-forbrug for '+ z_DATA[i].title.toLowerCase() +':</h2>');
                $view_footer.find('.z_yearly_cost_price').html('<h2 class="_strong"><span class="z_calc_saved">0</span> kr. pr. år</h2>');

                // Adding all question lines
                for( var j = 0; j < z_DATA[i].options.length; j++ ) {

                    var $question;

                    if(z_DATA[i].options[j].modalDescription){
                        $question = $('<div class="z_radiobtn_bar_wrap">'+
                                        '<div class="z_bar_title">'+
                                            '<strong>'+ z_DATA[i].options[j].title +
                                                '<div class="popunder-trigger hover-in-out"></div>'+
                                                '<div class="popunder">'+
                                                    '<div class="popunder-content">'+
                                                        '<img src="' + z_DATA[i].options[j].modalImg + '" class="popunder-hero">'+
                                                        '<h3><strong>' + z_DATA[i].options[j].modalTitle + '</strong></h3>'+
                                                        z_DATA[i].options[j].modalDescription +
                                                    '</div>'+
                                                '</div>'+
                                            '</strong>'+
                                            '<div class="z_calc_row" data-cost="0"></div>'+
                                        '</div>'+
                                        '<div class="z_radiobtn_bar" data-value="'+ z_DATA[i].options[j].value +'"></div>'+
                                        '<span class="z_error"></span>'+
                                    '</div>');
                    }
                    else{
                        $question = $('<div class="z_radiobtn_bar_wrap">'+
                                        '<div class="z_bar_title">'+
                                            '<strong>'+ z_DATA[i].options[j].title +'</strong>'+
                                            '<div class="z_calc_row" data-cost="0"></div>'+
                                        '</div>'+
                                        '<div class="z_radiobtn_bar" data-value="'+ z_DATA[i].options[j].value +'"></div>'+
                                        '<span class="z_error"></span>'+
                                    '</div>');
                    }
                    

                    $q_wrap.append( $question );

                    // Then add 8 options for each question
                    var k = 0;
                    while( k < 9 ) {

                        var $option = $('<div class="z_radiobtn">'+
                                            '<span class="z_lbl" data-val="'+ k +'">'+
                                                '<span class="z_lbl_txt">'+ k +'</span>'+
                                                '<span class="z_lbl_bg"></span>'+
                                            '</span>'+
                                            '<span class="z_dot"></span>'+
                                        '</div>');

                        $question.find('.z_radiobtn_bar').append( $option );

                        k++;
                    }
                }
            }

            $('.bx-viewport').css('overflow', 'inherit');

        },

        // Disable autocomplete
        disableNativeAutocomplete: function() {
            $('input[type="text"]').prop('autocomplete', 'off');
        },

        // Get url query variable
        getQueryVariable : function (variable) {
                var query = window.location.search.substring(1);
                var vars = query.split("&");
                for (var i=0;i<vars.length;i++) {
                        var pair = vars[i].split("=");
                        if(pair[0] == variable){return pair[1];}
                }
                return(false);
        },

        // Get form data
        getFormData: function($form) {
            // Make sure form is wrapped in jquery
            $form = $($form);

            // Prepare data
            var data = {};

            // Get all form elements
            var $elements = $form.find('input,textarea,select').filter('[name]');

            // Loop through elements
            var $element; $elements.each(function(){
                // Get element
                $element = $(this);

                // Handle checkbox arrays
                if ($element.is('[type="checkbox"]')) {
                    // Is there multiple checkboxes with same name?
                    if ($('input[type="checkbox"][name="' + $element.attr('name') + '"]').not($element).length) {
                        if (typeof data[$element.attr('name')] === 'undefined') {
                            data[$element.attr('name')] = [];
                        }
                    }

                    // Make sure checkbox is selected
                    if (!$element.prop('checked')) {
                        return true;
                    }

                    // Handle array
                    if ($.isArray(data[$element.attr('name')])) {
                        data[$element.attr('name')].push($element.val());
                    } else if (typeof data[$element.attr('name')] === 'undefined') {
                        data[$element.attr('name')] = $element.val();
                    }
                } else if ($element.is('[type="radio"]')) {
                    // Make sure checkbox is selected
                    if ($element.prop('checked')) {
                        data[$element.attr('name')] = $element.val();
                    } else if (typeof data[$element.attr('name')] === 'undefined') {
                        data[$element.attr('name')] = '';
                    }
                } else {
                    data[$element.attr('name')] = $element.val();
                }
            });

            // return data
            return data;
        },

        // Handle newsletter signup
        handleNewsletter: function () {
            // Get checkbox
            var $checkbox = $('input[name="newsletterSignup"]');

            // Get container
            var $container = $('.sign-up-container');

            // Find form
            var $form = $container.find('form.newsletter-form');

            // Handle submit
            $form.on('submit', function (e) {
                // Prevent default
                e.preventDefault();

                // Make sure required fields has been filled
                if (!MAIN.required()) {
                    return;
                }

                // Get form data
                var data = MAIN.getFormData($form);

                // Terms checked?
                if (typeof data.terms === 'undefined' || data.terms != '1') {
                    // Set error
                    $container
                        .find('input[name="terms"]')
                        .closest('.orsted-checkbox')
                        .addClass('error');

                    // Show error text
                    $container
                        .find('.terms-error')
                        .removeClass('hidden');

                    // Return
                    return;

                } else {
                    // Set error
                    $container
                        .find('input[name="terms"]')
                        .closest('.orsted-checkbox')
                        .removeClass('error');

                    // Show error text
                    $container
                        .find('.terms-error')
                        .addClass('hidden');
                }

                // Fix data
                var fixedData = {
                    name: data.name,
                    surName: data.surName,
                    address: data.address,
                    zip: data.zip,
                    city: data.city,
                    isCustomer: data.orstedCustomer == '1',
                    phone: data.phone,
                    email: data.email,
                    customerId: data.customerId,
                    source: 'standby-forbrug',
                };

                // Send request
                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(fixedData),
                    contentType: 'text/plain',
                    processData: false,
                    xhrFields: { withCredentials: true },
                    url: MAIN.apiBase + '/newsletter',
                    success: function (data) {
                        // Blur any current active element
                        $(document.activeElement).blur();

                        // Hide container
                        $container.addClass('hidden');
                        $('.newsletter').remove();

                        // Show confirmation
                        $('.sign-up-confirmation').removeClass('hidden');
                        // $('.bx-wrapper').addClass('hidden');

                        // Track nyhedsbrev signup
                        MAIN.tracking('Step 8: Nyhedsbrev tilmeldt');

                        // Uncheck newsletter
                        $checkbox.closest('.form-group').addClass('hidden').off('change');

                        // Kvitteringsside
                        $('[data-bind]').each(function(i, item){
                            // Get bind value
                            var $el = $(item),
                                    value = $el.data('bind');

                            // Handle name
                            if (value === 'fullName') {
                                $el.html($.trim([fixedData.name, fixedData.surName].join(' ')))
                            } else if (value === 'address') {
                                $el.html(fixedData.address);
                            } else if (value === 'phone') {
                                $el.html(fixedData.phone);
                            } else if (value === 'mail') {
                                $el.html(fixedData.email);
                            } else if (value === 'customerId') {
                                if (fixedData.customerId == '') {
                                    $('.customerid-container').hide();
                                } else {
                                    $el.html(fixedData.customerId);
                                }
                            }
                        });
                    },
                    error: function (err) {

                    }
                });
            });

            // Handle change
            $checkbox.on('change', function () {
                // Show or hide newsletter signup?
                if ($(this).is(':checked')) {

                    // Show form
                    $container.removeClass('hidden');

                    // Track nyhedsbrev signup
                    MAIN.tracking('Step 7: Nyhedsbrev checkbox');

                    // Hide confirmation
                    $('.sign-up-confirmation').addClass('hidden');

                    // Set focus in first input
                    setTimeout(function() {
                        $container.find('input[name="name"]').focus();
                    }, 250);
                } else {
                    // Hide form
                    $container.addClass('hidden');
                }
            });

            // Trigger change
            $checkbox.trigger('change');

            // Handle customerId check
            $container.find('input[name="orstedCustomer"]').on('change', function() {
                // Check value
                if ($(this).val() == 1) {
                    $container.find('.customerid').removeClass('hidden');
                } else {
                    $container.find('.customerid').addClass('hidden');
                }
            });

            // Trigger change
            $container.find('input[name="orstedCustomer"]:checked').trigger('change');

            // Find terms-overlay
            var $termsOverlay = $container.find('.terms-overlay');

            // Handle close
            $termsOverlay.hammer().on('tap click mousedown', function (e) {
                // Prevent propagation
                e.preventDefault();
                e.stopPropagation();

                // Not tap? skip
                if (e.type !== 'tap') {
                    return;
                }

                // Hide overlay
                setTimeout(function(){ $termsOverlay.trigger('hide'); }, 200);
            });

            // Show event
            $termsOverlay.on('show', function() {
                // Blur any active element
                $(document.activeElement).blur();

                // Show terms
                TweenLite.from($termsOverlay, 0.3, {
                    opacity: 0,
                    onStart: function() {
                        $termsOverlay.removeClass('hidden');
                    }
                });
            });

            // Hide event
            $termsOverlay.on('hide', function() {
                // Show terms
                TweenLite.to($termsOverlay, 0.3, {
                    opacity: 0,
                    onComplete: function() {
                        $termsOverlay.addClass('hidden');
                        TweenLite.set($termsOverlay, {opacity: 1});
                    }
                });
            });

            // Handle terms
            $container.find('a[data-action="show-terms"]').on('click', function(e) {
                e.preventDefault();
                $termsOverlay.trigger('show');
            });
        },

        // Tooltip for form elements
        formHelp: function() {
            $('.form-help').each(function() {
            var $formHelp = $(this),
                $label = $formHelp.parent(),
                $text = $formHelp.data('help'),
                $input = $label.parent().find('input'),
                $labels = $('body').find('label, legend').not($label),
                $help = $('<div>', { class: 'form-help-text', html: $text });
    
            // Trigger form help and set position and width
            $formHelp.on('mouseenter click', function() {
                var $width = $(this).position().left + ($(this).width() * 2),
                    $top = $(this).height() + 8;
    
                // Adjust width for active label
                if ($label.is('.is-active')) {
                $width += 10;
                }
    
                // Specifically for legend
                if ($label.is('legend')) {
                $top += 4;
                $width -= 16;
                }
    
                // If input is disabled
                // don't show form help
                if (!$label.is('.disabled')) {
                $label.append($help);
                }
                
                // Set classes and properties
                $labels.addClass('below');
                $help.css({'top': $top, 'min-width': $width +'px'});
                $formHelp.addClass('on');
    
                return false;
            }).on('mouseleave', function() {
                // Remove classes and properties
                $help.remove();
                $labels.removeClass('below');
                $formHelp.removeClass('on');
            });
            });
        },
    
        // Terms popover
        popover: function() {
            $('.popover, .popunder').each(function() {
            var $pop = $(this),
                $popcon = $pop.find('[class*="-content"]'),
                $closex = $('<span class="close"/>').prependTo($popcon),
                $trigger = $pop.parent().find('[class*="-trigger"]'),
                $parent = $pop.parents().filter(function() {
                return $(this).css('position') == 'relative' }).first();
            
            // There can be only one close X
            if (!$closex.is(':only-of-type')) {
                $closex.siblings('span').remove();
            }
    
            /*
            // Remove close X if not needed
            if ($pop.is('.no-x') || $trigger.is('.hover-in-out')) {
                $closex.remove();
            }
            */
    
            // Handle close X click
            $closex.on('click touchstart', function() {
                $pop.removeClass('show').blur();
            });
    
            // Three ways to trigger pop box
            // Hover-in
            if ($trigger.is('[class*="hover-in"]')) {
                $trigger.on('mouseenter click', popBox);
                // Hover-in-out
                if ($trigger.is('[class*="-out"]')) {
                $trigger.on('mouseleave', function() {
                    $pop.removeClass('show').blur();
                });
                }
            } else { // Click
                $trigger.on('click', popBox);
            }
    
            // Calculate and set position of the box
            function popBox() {
                var $popover = $(this).siblings('.popover'),
                    $popunder = $(this).siblings('.popunder'),
                    $parentLeft = $parent.position().left,
                    $parentRight = $parent.width(),
                    $triggerLeft = $trigger.position().left,
                    $popoverWidth = $pop.outerWidth(),
                    $triggerWidth = $trigger.outerWidth(),
                    $widthDiff = ($popoverWidth - $triggerWidth) / 2,
                    $popoverLeft = $triggerLeft - $widthDiff,
                    $popoverRight = $popoverLeft + $popoverWidth,
                    $popunderTop = $trigger.position().top + ($trigger.height() + 6);
    
                // Hide all other popover or popunder boxes
                $('.popover, .popunder').removeClass('show');
                
                // If left boundary exceeded
                if ($popoverLeft <= $parentLeft) {
                $popoverLeft = $parentLeft;
                }
                
                // If right boundary exceeded
                if ($popoverRight >= $parentRight) {
                $popoverLeft = $parentRight - $popoverWidth;
                }
    
                // Set popover position
                $popover.css({
                'left': $popoverLeft
                }).addClass('show').focus();
                
                // Set popunder position
                $popunder.css({
                'top': $popunderTop,
                'left': $popoverLeft
                }).addClass('show').focus();
    
                return false;
            }
    
            // Hide box when click anywhere but trigger
            $(document).on('click', function() {
                $pop.removeClass('show').blur();
            });
            }).on('click', function() {	return false; });
        },
    
        // Handle image theme background
        imageTheme: function() {
            $('[class*="theme-image"][data-image]').each(function() {
            var $theme = $(this),
                $size = $theme.data('size'),
                $image = $theme.data('image'),
                $position = $theme.data('position'),
                $background = $('<div/>'),
                $class = $theme.is('[class*="-circle"]')
                ? 'theme-image-circle-background'
                : 'theme-image-background';
    
            // Set background css properties
            $background.css({
                'background-image': 'url('+ $image +')',
                'background-position': $position,
                'background-size': $size
            }).addClass($class);
    
            // Insert background image
            $theme.prepend($background);
        
            // Make sure there is only one background
            if (!$background.is(':only-child')) {
                $background.siblings().remove();
            }
            });
        },
    
        // Wrap last word in arrow span
        linkArrow: function() {
            $('[class*="link-arrow"]')
            .not('.link-arrow-back')
            .each(function() {
            var $link = $(this).html().split(' ');
    
            // Wrap the last word + arrow in span
            $link = $link.slice(0, -1).join(' ') +
            ' <span class="arrow">' +
            $link.pop() + '</span>';
    
            // Insert span tag
            $(this).html($link);
            });
        },

    };

    MAIN.init();

})(jQuery);