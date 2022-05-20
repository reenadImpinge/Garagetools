/**
Quote Module
**/
var Quote = function () {
    var customer_info = "";
    var quote_item    = "";
    var customer_id   = $('#quotes-customer_id').val();
    // get customer info
    var getCustomerInfo = function(customer_id) {
        $.ajax({
            method: "GET",
            url: "/ajax/get-customer-info",
            dataType: 'json',
            async: false,
            data: { customer_id: customer_id }
        }).done(function( data ) {
            customer_info = data;
        });
    };

    var vehicleType = function() {
        $('input[type=radio][name=vehicle_type]').click(function(){
            if($(this).hasClass("hasChecked")) {
                $('input[type=radio][name=vehicle_type]').prop("checked", false);
                $('.has_vehicle').val(1);
                $(".cars").removeClass("hide");
                if ($(".vehicle_manually").hasClass("hide") && $(".not_vehicle").hasClass("hide")) {
                    $(".vehicle_manually").removeClass("hide");
                }
                $(this).removeClass("hasChecked");
                var html = '<option value="1" selected="">Fixed square footage</option><option value="2">Percentage square footage</option>';

                $('.square_footage_type').html(html);
            } else {
                $('.has_vehicle').val(0);
                $(this).addClass("hasChecked");
                $(".cars").addClass("hide");
                var html = '<option value="1" selected="">Fixed square footage</option>';
                $('.square_footage_type').html(html);
            }
        });

        $('.vehicle').click(function(){
            if ($(this).hasClass("hasVehicle")) {
                $('.has_vehicle').val(1);
                $(".not_vehicle").addClass("hide");
                $(".vehicle_manually").removeClass("hide");
                $(this).removeClass("hasVehicle");
                $(this).text("My Vehicle is Not Listed / This isn't for a Vehicle");
                $($(this).parent()).attr('style', "margin-bottom: 20px;left:-100px");
                return false;
            }

            $(".not_vehicle").removeClass("hide");
            $(".vehicle_manually").addClass("hide");
            $(this).text("Select Vehicle");
            $('.has_vehicle').val(2);
            $($(this).parent()).attr('style', "margin-bottom: 20px;left:0px");
            $(this).addClass("hasVehicle");
        });
    };

    var chooseMethod = function() {
        $('input[type=radio][name=method]').change(function(){
            if ($(this).val() == 'new'){
                total();
            } else {
               buildCustomerInfo();
                total();
            }
            checkMethod();
        });
    };

    var checkMethod = function() {
        var method = $('input[type=radio][name=method]:checked').val();
         if(method == 'new'){
            $('#choose-customer').addClass('hidden');
            $('#new-customer').removeClass('hidden');
        } else {
            $('#new-customer').addClass('hidden');
            $('#choose-customer').removeClass('hidden');
        }
        return method;
    };

    var clearInput = function(){
        $('#customer-first_name').val('');
        $('#customer-last_name').val('');
        $('#customer-email').val('');
        $('#customer-company').val('');
        $('#customer-details').val('');
        $('#customer-phone').val('');
        $('#customer-address').val('');
        $('#customer-city').val('');
        $('#customer-state').val('');
        $('#customer-zipcode').val('');
        $('#customer-state').val('');
    };

    var clearCustomerInfo = function(){
        $('#text-first_name').html('');
        $('#text-last_name').html('');
        $('#text-email').html('');
        $('#text-company').html('');
        $('#text-details').html('');
        $('#text-phone').html('');
        $('#text-country').html('');
        $('#text-address').html('');
        //$('#text-city').html('');
        $('#text-source').html('');
        $('#text-zipcode').html('');
        $('#text-state').html('');
        $('#text-taxable').html('No');
        $('#text-tax_resale_no').html('0');
    };

    var buildCustomerInfo = function(){
        if( customer_info ){
            if(customer_info.first_name){
                $('#text-first_name').html(customer_info.first_name);
            } else {
                $('#text-first_name').html(customer_info.name);
            }
            $('#text-last_name').html(customer_info.last_name);
            $('#text-email').html(customer_info.email);
            $('#text-company').html(customer_info.company);
            $('#text-details').html(customer_info.details);
            $('#text-phone').html(customer_info.phone);
            $('#text-country').html(customer_info.country);
            $('#text-address').html(customer_info.address);
            $('#text-source').html(customer_info.source_info);
            //$('#text-state').html(customer_info.state);
            $('#text-zipcode').html(customer_info.zipcode);
            $('#text-state').html(customer_info.state);
            if (customer_info.taxable == 1) {
                $('#text-taxable').html('Yes');
            } else{
                $('#text-taxable').html('No');
            }

            if(customer_info.tax_resale_no == "" || customer_info.tax_resale_no==null || customer_info.tax_resale_no=="0.00") {
                customer_info.tax_resale_no = 0;
            }

            $('#text-tax_resale_no').html(parseInt(customer_info.tax_resale_no));
            var tax_code_rate_df = $('#text-tax_resale_no');
           _rate_value           = customer_info.tax_resale_no;
            taxable              = customer_info.taxable;
        } else {
            clearCustomerInfo();
        }
    };

    var reloadWraptype = function() {
        var prodcut_service = $('.item-wrap-type');

        $.ajax({
            url: '/ajax/load-wrap-type',
            type:"GET",
            dataType: 'JSON',
            success: function(r){
                if(r.code == 200) {
                    prodcut_service.each(function(key, value) {
                        $(value).html(r.html);
                        $(value).val("");
                    });
                }
            }
        });
    }

    var reloadMaterial = function() {
        var material = $('.item-material');

        $.ajax({
            url: '/ajax/load-material',
            type:"GET",
            dataType: 'JSON',
            success: function(r){
                if(r.code == 200) {
                    material.each(function(key, value) {
                        $(value).html(r.html);
                        $(value).val("");
                    });
                }
            }
        });
    }

    var loadMaterialInfo = function(material_id){
        return $.ajax({
            method: "GET",
            url: "/ajax/material-info",
            dataType: 'json',
            async: false,
            data: {"id" : material_id},
            success: function(data) {
                    var json_str = JSON.stringify(data); 
                    var obj = JSON.parse(json_str);
                    console.log(obj);
                    $.each(obj, function (i,v) {
                        
                        if(v.price_type == 'percentage') {
                            $("#tav_quote tr.quote-item").each(function(){
                                $(this).find(".form-control.square_footage_num_m").val(parseInt(v.price));
                                $(this).find(".form-control.square_footage_type_m").val(2);
                            });


                        } else if(v.price_type == 'roll') {
                            $("#tav_quote tr.quote-item").each(function(){     
                                $(this).find(".form-control.square_footage_num_m").val(parseInt(v.roll_price));
                                $(this).find(".form-control.square_footage_type_m").val(3);
                                $(this).find("input[name^=dimensions]").val(v.dimensions);
                                $(this).find("input[name^=rollUnits]").val(v.roll_price_unit);
                            });

                        } else {
                            $("#tav_quote tr.quote-item").each(function(){     
                                $(this).find(".form-control.square_footage_num_m").val(parseInt(v.fixed_price));
                                $(this).find(".form-control.square_footage_type_m").val(1);
                            });
                            
                        }

                });
            }
          });
    };

        var loadServiceInfo = function(service_id){
        return $.ajax({
            method: "GET",
            url: "/ajax/service-info",
            dataType: 'json',
            async: false,
            data: {"id" : service_id}
          });
    };

    // var changeMaterial = function() {
        
    //     $(document).on('change','.item-material',function(){
    //         var elm = $(this);
    //         var parent = elm.parents('.quote-item');
    //         var elm_quantity = parent.find('.item_quantity');
    //         var elm_price   = parent.find('.item_price');
    //         var elm_des   = parent.find('.item-description');
    //         var item_labor_cost =  parent.find('.item-labor-cost');
    //         var _service_info = loadMaterialInfo(elm.val()).responseJSON;

    //         if(_service_info) {
    //             elm_quantity.val(1);
    //             elm_price.val(_service_info.price);
    //             elm_des.html(_service_info.description);
    //             item_labor_cost.val(_service_info.labor_cost);
    //         } else {
    //             elm_quantity.val(0);
    //             elm_price.val(0);
    //             item_labor_cost.val(0);
    //             elm_des.html('');
    //         }
    //         totalRow(elm);
    //     });
    // }

    var changeService = function(){
        $(document).on('change','.item_service_id',function(){
            var elm = $(this);
            var parent = elm.parents('.quote-item');
            var elm_quantity = parent.find('.item_quantity');
            var elm_price   = parent.find('.item_price');
            var elm_des   = parent.find('.item-description');
            var _service_info = loadServiceInfo(elm.val()).responseJSON;
            if(_service_info){
                elm_quantity.val(1);
                elm_price.val(_service_info.price);
                elm_des.html(_service_info.description);
            } else {
                elm_quantity.val(0);
                elm_price.val(0);
                elm_des.html('');
            }
            totalRow(elm);
        });
    };

    var changeTax = function(){
        var listTax = $('.item_tax_id');
        listTax.each(function(i,item){
           if($(item).val() != null || $(item).val() != '') {
              compareTax($(item));
           } 
        });

        $(document).on('change','.item_tax_id',function(){
            var elm = $(this);
            compareTax(elm);
        });
    };

    var compareTax = function(elm) {
         var parent = elm.parents('.quote-item');
            var rate = parent.find('.item_tax_rate');
            var tax_name =  parent.find('.item_tax_name');
            var tax_rate_show = parent.find('.tax_rate_show_value');
            var _tax_info = loadTaxInfo(elm.val()).responseJSON;
            if(_tax_info){
                rate.val(_tax_info.rate);
                tax_name.val(_tax_info.name);
                tax_rate_show.text(_tax_info.rate+' %');
            }
            else
            {
                rate.val('0');
                tax_name.val('');
                tax_rate_show.text('');
            }
            totalRow(elm);
    };

    var loadTaxInfo = function(tax_id){
        return $.ajax({
            method: "GET",
            url: "/ajax/tax-info",
            dataType: 'json',
            async: false,
            data: {"id" : tax_id}
          });
    };

    var totalRow = function(elm){
        var parent        = elm.parents('.quote-item');
        var elm_quantity  = parent.find('.item_quantity');
        var elm_price     = parent.find('.item_price');
        var elm_total     = parent.find('.item_total');
        var elm_sub_total = parent.find('.item_sub_total');
        var laborCost     = parent.find('.item-labor-cost');
        //var _total = parseFloat(elm_quantity.val()) * parseFloat(elm_price.val());
        var _total = 0;

        if (laborCost.length > 0) {
            var footageDefault = $('#car-square_footage').val(); // footage in vehicle tab
            var wrap_type = parent.find('.square_footage_type').val();
            var wrap_type_val = parent.find('.square_footage_num').val();
            var material_type = parent.find('.square_footage_type_m').val();
            var material_type_val = parent.find('.square_footage_num_m').val();
            var footage = 0;
            var price = 0;
            if(wrap_type == 1) {
                // this means it is fixed type
                //need to ask query.
                footage = footageDefault;
            } else {
                // this means it is percentage type
                footage = footageDefault / wrap_type_val;
            }
            // now calculating cost price using material selected:
            if(material_type == 1) {
                // fixed price
                price = parseFloat(material_type_val);
            } else if(material_type == 2) {
                // cost per square foot
                price = parseFloat(material_type_val) * parseFloat(footage);
            } else {
                // cost per roll
                // var dimensions = parent.find('input[name^=dimensions]').val();
                // var dimensions_unit = parent.find('input[name^=rollUnits]').val();
                // var roll_footage_arr = dimensions.split('x');
                var length = parent.find('input[name^=length]').val();
                var width = parent.find('input[name^=lengthUnit]').val();
                var lengthU = parent.find('input[name^=width]').val();
                var widthU = parent.find('input[name^=widthUnit]').val();
                // if(dimensions_unit == 'in') {
                //     // inches
                //     var roll_footage = (parseFloat(roll_footage_arr[0])*parseFloat(roll_footage_arr[1]))/12;
                    
                // } else {
                //     // feet
                //     var roll_footage = parseFloat(roll_footage_arr[0])*parseFloat(roll_footage_arr[1]);
                // }
                    var rolls = Math.ceil(footage/roll_footage);
                    price = parseFloat(material_type_val) * rolls;
               

            }

            _total += parseFloat(elm_quantity.val()) * parseFloat(elm_price.val());
            _total += parseFloat(laborCost.val());
            _total += parseFloat(price);


        }
        console.log(_total);

        if(isNaN(_total )) {
            _total = 0;
        }

        elm_total.text(currency_symbol+ _total.toFixed(2));
        elm_sub_total.val(_total.toFixed(2));
        total();
    };

    var total = function() {
        var total_rows = $('.item_total');
        var total      = 0;
        $.each(total_rows,function(index,value){
            total += Number($(this).text().replace(/[^0-9\.]+/g,""));
        });

        $('#total-amount').text(currency_symbol + total.toFixed(2));
        var dicount_total        = $('#quotes-discount');
        var discount_total_type  = $('#quotes-discount_type');
        var total_after_discount = $('#total_after_discount');
        var _discount_price      = 0;
        if (discount_total_type.val() == 1) {
            _discount_price  = parseFloat( total) - (parseFloat( total) *  parseFloat( dicount_total.val()) ) / 100;
        } else {
            _discount_price  = parseFloat( total) -  parseFloat( dicount_total.val()) ;
        }

        var total_tax          = $('#customer_tax');
        var total_after_tax_df = $('#total_after_tax');
        var total_after_tax    = 0;

        if(taxable == 0 && _rate_value == 0) {
            if(isNaN(tax_setting)) {
               tax_setting = 0;
            }
            total_tax.text(parseFloat(tax_setting).toFixed(2)+' %');
            $('#quotes-tax_rate').val(tax_setting);
            total_after_tax =  _discount_price +   (parseFloat( _discount_price) *  parseFloat(tax_setting) ) / 100;
        } else {
            if(isNaN(tax_setting)) {
               tax_setting = 0;
            }
            $('#quotes-tax_rate').val(0);
            total_tax.text('0 %');
            total_after_tax =  _discount_price +   (parseFloat( _discount_price) *  parseFloat(0) ) / 100;
        }

        if(isNaN( _discount_price)) {
            _discount_price = 0;
        }

        if(isNaN(total_after_tax)) {
            total_after_tax = 0;
        }

        total_after_discount.text(currency_symbol + _discount_price.toFixed(2))
        total_after_tax_df.text(currency_symbol +total_after_tax.toFixed(2))
        $('#quotes-total_after_discount').val(_discount_price.toFixed(2));
        $('#quotes-total_after_tax').val(total_after_tax.toFixed(2));
    };

    var changeRow = function(){
        $(document).on('change','.item_quantity, .item_price, .item-labor-cost, .square_footage_num, .square_footage_type',function(){
            totalRow($(this));
        });
    };

    var changeTotalRow = function() {
         $(document).on('change','#quotes-discount_type,#quotes-discount',function(){
             total();
        });
    };

    var changeDeposit = function(){
        $('#quotes-deposit').change(function(){
            checkDeposit();
        });
    };

    var addItem = function(){
        $('.glyphicon-plus').click(function(){
            var index = $(this).attr('data-number');
            var item = buildRowItem(index).prop('outerHTML');
            $('#invoice-main').append(item);

            $('#quoteitems-'+index+'-wrap_type_id').find('option:selected').prop('selected',false);
            $('#quoteitems-'+index+'-material_id').find('option:selected').prop('selected',false);

            $('#invoice-main').find("tr:last-child").find(".item_service_id").find('option:selected').prop('selected',false);
            $('#invoice-main').find("tr:last-child").find(".item_tax_id").find('option:selected').prop('selected',false);

            $(this).attr('data-number',parseInt(index)+1);

            checkRemove();
        });
    };

    var removeItem = function(){
        $(document).on('click','.glyphicon-minus',function(){
             $(this).parents('.quote-item').remove();
            checkRemove();
            total();
        });
    };

    var buildRowItem = function(index){
        var rowItem = quote_item.clone();
        rowItem.find(".has-error").removeClass('has-error');
        rowItem.find(".help-block").html('');
        rowItem.find(".item_service_id").attr('name','QuoteItems['+index+'][service_id]');
        rowItem.find(".item-description").attr('name','QuoteItems['+index+'][description]').html('');
        rowItem.find(".item_quantity").attr('name','QuoteItems['+index+'][quantity]').attr('value','0');
        rowItem.find(".item_price").attr('name','QuoteItems['+index+'][price]').attr('value','0');
        rowItem.find(".item_tax_name").attr('name','QuoteItems['+index+'][tax_name]').attr('value','');
        rowItem.find(".item_tax_rate").attr('name','QuoteItems['+index+'][tax_rate]').attr('value','0');
        rowItem.find(".item_tax_total").attr('name','QuoteItems['+index+'][tax_total]').attr('value','0');
        rowItem.find(".item_sub_total").attr('name','QuoteItems['+index+'][sub_total]').attr('value','0');
        rowItem.find(".item_tax_id").attr('name','QuoteItems['+index+'][tax_id]');
        rowItem.find(".item_total").text('$0.00');

        if (rowItem.find(".item-labor-cost").length > 0) {
            rowItem.find(".item-labor-cost").attr('name','QuoteItems['+index+'][labor_cost]').attr('value','0');
            //$('#car-square_footage').val();
            rowItem.find(".square_footage_num").attr('name','QuoteItems['+index+'][square_footage_num]').attr('value', 0);
            rowItem.find(".square_footage_type").attr('name','QuoteItems['+index+'][square_footage_type]');
            rowItem.find(".item-material").attr('name','QuoteItems['+index+'][material_id]');
            rowItem.find(".item-material").attr('id','quoteitems-'+index+'-material_id');

            rowItem.find(".item-wrap-type").attr('name','QuoteItems['+index+'][wrap_type_id]');
            rowItem.find(".item-wrap-type").attr('id','quoteitems-'+index+'-wrap_type_id');
        }

        return rowItem;
    };

    //check deposit
    var checkDeposit = function(){
        var deposit = $('#quotes-deposit').val();
        if( deposit == '1'){
            $('#row-deposit').removeClass('hidden');
        } else {
            $('#row-deposit').addClass('hidden');
        }
    };

    // check hidden button remove
    var checkRemove = function(){
        var button_remove = $('.invoice-icon');
        if(button_remove.length <= 1){
            button_remove.addClass('hidden');
        } else {
            button_remove.removeClass('hidden');
        }
    };

    var add_new_location = function() {
        $(document).on('click','.add_new_location_in_quote', function(e){
            e.preventDefault();
             //document.getElementById('iframe_location').contentWindow.location.reload(true);
            $('.form_add_new_location').modal('show');
            $('#iframe_location').contents().find('.help-block').text('');
            $('#iframe_location').contents().find('input').val('');
            $('#iframe_location').contents().find('.alert').remove();
        });

         $(document).on('click','.location_close', function(e){
            e.preventDefault();
            var elm          = $(this);
            var location = $('#quotes-location_id');
            var url      = elm.attr('data-url');
            $.ajax({
                url: url,
                type:"GET",
                dataType: 'JSON',
                success: function(r) {
                    if(r.code == 200) {
                        location.html(r.html);
                    }
                }
            });
        });
    };

    var tax = function() {
        $(document).on('change','#customer-tax_resale_no',function() {
            if ($("#customer-tax_resale_no").val() == "" || $("#customer-tax_resale_no").val() == 0) {
                _rate_value = 0;
            } else {
                _rate_value = 1;
            }
            total();
        });

        $(document).on('change','#customer-taxable',function() {
            if ($('#customer-taxable').prop("checked") == false) {
               taxable = 0;
            } else {
                taxable = 1;
            }
            total();
        });
    };

     var add_new_product_service = function() {
        $(document).on('click','.add_new_product_service', function(e){
            e.preventDefault();
            $('.form_add_new_product_service').modal('show');
            $('#iframe_product_service').contents().find('.help-block').text('');
            $('#iframe_product_service').contents().find('input').val('');
            $('#iframe_product_service').contents().find('.alert').remove();
        });

        $(document).on('click','.add_new_wrap_type', function(e){
            e.preventDefault();
            $('.form_add_new_wrap_type').modal('show');
            $('#iframe_wrap_type').contents().find('.help-block').text('');
            $('#iframe_wrap_type').contents().find('input').val('');
            $('#iframe_wrap_type').contents().find('.alert').remove();
        });

        $(document).on('click','.add_new_material', function(e){
            e.preventDefault();
            $('.form_add_new_material').modal('show');
            $('#iframe_material').contents().find('.help-block').text('');
            $('#iframe_material').contents().find('input').val('');
            $('#iframe_material').contents().find('.alert').remove();
        });

        $(document).on('click','.wrap_type_close, .wrap_type_footer_close', function(e){
            e.preventDefault();
            reloadWraptype();
        });

        $(document).on('click','.material_close, .material_footer_close', function(e){
            e.preventDefault();
            reloadMaterial();
        });

         $(document).on('click','.product_service_close,.product_service_footer_close', function(e){
            e.preventDefault();
            var elm             = $(this);
            var prodcut_service = $('.' + elm.attr('update-field') + '');
            var url             = elm.attr('data-url');

            $.ajax({
                url: url,
                type:"GET",
                dataType: 'JSON',
                success: function(r){
                    if(r.code == 200) {
                        if(prodcut_service.length > 0) {
                            prodcut_service.each(function(key,value) {
                                var data = $(value).val();
                                $(value).html(r.html);
                                $(value).val(data);
                            });
                        }
                        $('.alert-danger-payment').addClass('hide');
                    }
                }
            });
        });
    };

    var customerAutocomplete = function() {
        var customers = new Bloodhound({
            datumTokenizer: function (datum) {
                return Bloodhound.tokenizers.whitespace(datum.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: {
                url: "/ajax/get-customers?owner_id="+$('#owner_id').val(),
                filter: function (data) {
                    return $.map(data.customers, function (name, id) {
                        return {
                            id: id,
                            name: name
                        };
                    });
                }
            }
        });

       

        var companies = new Bloodhound({
            datumTokenizer: function (datum) {
                return Bloodhound.tokenizers.whitespace(datum.name);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: {
                url: "/ajax/get-companies?owner_id="+$('#owner_id').val(),
                filter: function (data) {
                    return $.map(data.companies, function (name, id) {
                        return {
                            id: id,
                            name: name
                        };
                    });
                }
            }
        });

        customers.clearPrefetchCache();
        customers.initialize();
        companies.clearPrefetchCache();
        companies.initialize();

        // instantiate the typeahead UIitem-wrap-type
        $('.customer-typeahead').typeahead(
          {
              hint: true,
              highlight: true,
              minLength: 1
          },
          {
              name: 'customers',
              displayKey: 'name',
              source: customers.ttAdapter(),
              templates: {
                  suggestion: Handlebars.compile('<p>{{name}}</p>')
              }
          },
          {
              name: 'companies',
              displayKey: 'name',
              source: companies.ttAdapter(),
              templates: {
                  suggestion: Handlebars.compile('<p>{{name}}</p>')
              }
          }).on("typeahead:selected", function(obj, datum, name) {
              customer_id = datum.id;
              $('#quotes-customer_id').val(customer_id);
              getCustomerInfo(customer_id);
              buildCustomerInfo();
              total();
          });
    };

    var setTaxDefault = function() {
        var method = $('input[type=radio][name=method]:checked').val();
         if (method == 'new') {
                if ($("#customer-tax_resale_no").val() == "" || $("#customer-tax_resale_no").val() == 0) {
                    _rate_value = 0;
                } else {
                    _rate_value = 1;
                }

                if ($('#customer-taxable').prop("checked") == false) {
                   taxable = 0;
                } else {
                    taxable = 1;
                }
         } else {
            _rate_value = customer_info.tax_resale_no;
            taxable     = customer_info.taxable;
         }
        
    };

    var changeWrapType = function(){
        $(document).on('change','.form-control.item-wrap-type',function(){
           
            var wrap_id = $(this).val();
            var owner_id = $('#owner_id').val();
            $.ajax({
                method: "POST",
                url: "/ajax/get-wrap-details",
                dataType: 'json',
                async: false,
                data: { 'wrap_id': wrap_id, 'owner_id': owner_id }
                }).done(function(data) {
                    var json_str = JSON.stringify(data); 
                    var obj = JSON.parse(json_str);
                    $.each(obj, function (i,v) {
                        console.log(v.name);
                        console.log(v);
                        if(v.price_type == 'percentage') {
                        $("#tav_quote tr.quote-item").each(function(){
                            $(this).find(".form-control.square_footage_num").val(parseInt(v.percentage_of_car));
                            $(this).find(".form-control.square_footage_type").val(2);
                            // $(this).find(".form-control.square_footage_num_m").val(parseInt(data.percentage_of_car));
                            // $(this).find(".form-control.square_footage_type_m").val(2);
                        });


                    } else {
                        $("#tav_quote tr.quote-item").each(function(){

                            $(this).find(".form-control.square_footage_num").val(parseInt(v.fixed_price));
                            $(this).find(".form-control.square_footage_type").val(1);
                            // $(this).find(".form-control.square_footage_num_m").val(parseInt(data.fixed_price));
                            // $(this).find(".form-control.square_footage_type_m").val(1);
                        });
                        
                    }

                    });
                    

            });
        });
    };

    var changeMaterial = function(){

      
        $(document).on('change','.item-material', function(){
            console.log('fired');

            var material_id = $(this).val();
            var owner_id = $('#owner_id').val();
            // $.ajax({
            //     method: "POST",
            //     url: "/ajax/get-wrap-details",
            //     dataType: 'json',
            //     async: false,
            //     data: { 'wrap_id': wrap_id, 'owner_id': owner_id }
            //     }).done(function(data) {
            //         var json_str = JSON.stringify(data); 
            //         var obj = JSON.parse(json_str);
            //         $.each(obj, function (i,v) {
            //             console.log(v.name);
            //             console.log(v);
            //             if(v.price_type == 'percentage') {
            //             $("#tav_quote tr.quote-item").each(function(){
            //                 $(this).find(".form-control.square_footage_num").val(parseInt(v.percentage_of_car));
            //                 $(this).find(".form-control.square_footage_type").val(2);
            //                 // $(this).find(".form-control.square_footage_num_m").val(parseInt(data.percentage_of_car));
            //                 // $(this).find(".form-control.square_footage_type_m").val(2);
            //             });


            //         } else {
            //             $("#tav_quote tr.quote-item").each(function(){

            //                 $(this).find(".form-control.square_footage_num").val(parseInt(v.fixed_price));
            //                 $(this).find(".form-control.square_footage_type").val(1);
            //                 // $(this).find(".form-control.square_footage_num_m").val(parseInt(data.fixed_price));
            //                 // $(this).find(".form-control.square_footage_type_m").val(1);
            //             });
                        
            //         }

            //     });
                    

            // });







            var elm = $(this);
            var parent = elm.parents('.quote-item');
            var elm_quantity = parent.find('.item_quantity');
            var elm_price   = parent.find('.item_price');
            var elm_des   = parent.find('.item-description');
            var item_labor_cost =  parent.find('.item-labor-cost');
            var _service_info = loadMaterialInfo(elm.val()).responseJSON;

            if(_service_info){
                elm_quantity.val(1);
                elm_price.val(_service_info.price);
                elm_des.html(_service_info.description);
                item_labor_cost.val(_service_info.labor_cost);
            } else {
                elm_quantity.val(0);
                elm_price.val(0);
                item_labor_cost.val(0);
                elm_des.html('');
            }
            totalRow(elm);
        });
    };

    // public functions
    return {
        //main function
        init: function () {
            _rate_value = 0;
            taxable     = 0;
            setTaxDefault();
            quote_item = $( "tr.quote-item" ).first().clone();
            buildRowItem();
            checkMethod();
            vehicleType();
            chooseMethod();
            getCustomerInfo(customer_id);
            addItem();
            removeItem();
            buildCustomerInfo();
            checkDeposit();
            changeDeposit();
            changeService();
            //changeTax();
            changeRow();
            total();
            checkRemove();
            add_new_location();
            add_new_product_service();
            tax();
            changeTotalRow();
            customerAutocomplete();
            changeWrapType();
            changeMaterial();
        }
    };
}();
