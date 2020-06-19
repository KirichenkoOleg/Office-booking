$(function() {
    // плагины Gulp не поддерживают синтаксис ES6

    $('#inputLocation').autocomplete({
        source: function(request, response){
            // request - текущее содержимое текстового поля, для которого нужно подобрать элементы автозаполнения.
            // response - будет задана _функция_, которую будет необходимо вызвать и передать ей список подходящих элементов автозаполнения. 
            //-Он должен соответствовать тому же формату, что и в предыдущих случаях (массив строк или массив объектов).
            //-Необходимо отметить, что эта функция должна быть вызвана при любых обстоятельствах, даже если при подборе элементов автозаполнения произошла ошибка.
            
            $.ajax({
                url: "../data/location.json",
                dataType: "json",
                // обработка успешного выполнения запроса
                success: function(data){
                    var locList = [];//массив совпадений который будем возвращать

                    data.forEach(function(item) {
                        //метод проходит по массиву и бурет у каждого свойство под ключом label
                        var str = request.term;// получаем из формы
                        var strFull = item.label;// значение свойства label
                        var pattern = '^' + str +'\\w*';
                        var myRegExp = new RegExp(pattern, 'i');
                        var regExpResult = myRegExp.test( strFull );

                        if( regExpResult ) {
                            locList.push(item.label);
                        };
                    });
                    response( locList );
                },
            });
        },
        // minLength: 2,
    });

    $('#inputDate').datepicker({
        dateFormat: 'dd M yy',
        minDate: new Date(),
        onSelect: function(dateText, inst){
            //происходит в момент выбора даты в календаре
            // console.log( `Выбранная дата ${dateText}` ); 
        }
    });

    $( "#slider" ).slider({
        animate: "slow",
        range: "min",
        value: 6
    });

});