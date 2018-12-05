function atualiza_dados(){
    if ( $("#atualizacao-automatica")[0].checked )
    {
        
        $('#loading').show();
        faz_reconhecimento();
    }
}

function limpa_botoes() {
    $("#botaoPessoa").removeClass();
    $("#botaoCorpo").removeClass();
    $("#botaoMao").removeClass();
}

function identifica_pessoa(){
    faz_reconhecimento();
}

function identifica_corpo(){
    faz_reconhecimento();
}

function identifica_mao(){
    faz_reconhecimento();
}

function faz_reconhecimento(){
    jQuery.ajax({
        url     : '/reconhecePessoa',
        type    : 'GET',
        dataType: 'json',
        success : function(data){

            var tableWrapper = "<table><thead><tr><th>Sexo</th><th>Cert</th><th>Idade</th>";
			tableWrapper += "<th>Cert</th><th>Humor</th></tr></thead>";
            tableWrapper += "<tbody id=\"detalhe_reconhecimento\"></tbody></table>";
            
            $('#exposicao_dados').empty();
            $('#exposicao_dados').html( tableWrapper );

            $('#imagem').attr("src","/registros/" + data.image.endereco);

            limpa_botoes();
            if (data.face.length > 0)
                $("#botaoPessoa").addClass('primary button medium color4');
            else   
                $("#botaoPessoa").addClass('button medium color4');

            if (data.body.length > 0)
                $("#botaoCorpo").addClass('primary button medium color4');
            else   
                $("#botaoCorpo").addClass('button medium color4');
            
            if (data.hand.length > 0)
                $("#botaoMao").addClass('primary button medium color4');
            else   
                $("#botaoMao").addClass('button medium color4');
            
            //
            // Monta a tabela de reconhecimento de pessoas
            //
            var tabela = $("#detalhe_reconhecimento")[0];
            if ( data.face.length > 0 ) {

                $('#lista-pessoas').show();

                for(var i = 0; i < data.face.length; i++) {

                    // Insert a row in the table at the last row
                    var newRow   = tabela.insertRow();
                    
                    // Insert a cell in the row at index 0
                    var newCell  = newRow.insertCell();

                    var para = document.createElement("h2");
                    if (data.face[i].gender.gender == 0) {
                        para.appendChild(document.createTextNode("Mulher"));
                    }   
                    else {
                        para.appendChild(document.createTextNode("Homem"));
                    }
                    newCell.appendChild(para);

                    newCell  = newRow.insertCell();
                    newCell.appendChild(document.createTextNode(Math.round((data.face[i].gender.confidence/1000)*100) + "%"));

                    newCell  = newRow.insertCell();
                    para = document.createElement("h2");
                    para.appendChild(document.createTextNode(data.face[i].age.age));
                    newCell.appendChild(para);

                    newCell  = newRow.insertCell();
                    newCell.appendChild(document.createTextNode(Math.round((data.face[i].age.confidence/1000)*100) + "%"));

                    var humor = data.face[i].expression.neutral;
                    var imgHumor = "static/icons/neutro.png";

                    var imgAlt = "Neutro: " + data.face[i].expression.neutral + "% \n";
                    imgAlt += "Contente: " + data.face[i].expression.happiness + "% \n";
                    imgAlt += "Surpreso: " + data.face[i].expression.surprise + "% \n";
                    imgAlt += "Bravo: " + data.face[i].expression.anger + "% \n";
                    imgAlt += "Triste: " + data.face[i].expression.sadness + "% \n";
                    imgAlt += "Positivo: " + data.face[i].expression.positive + "%";

                    if (humor <= data.face[i].expression.happiness) {
	                    humor = data.face[i].expression.happiness;
                        imgHumor = "static/icons/contente.png";
                    }
                    if (humor <= data.face[i].expression.surprise) {
	                    humor = data.face[i].expression.surprise;
	                    imgHumor = "static/icons/surpreso.png";
                    }
                    if (humor <= data.face[i].expression.anger) {
	                    humor = data.face[i].expression.anger;
                        imgHumor = "static/icons/bravo.png";

                    }
                    if (humor <= data.face[i].expression.sadness) {
	                    humor = data.face[i].expression.sadness;
                        imgHumor = "static/icons/triste.png";
                    }
                    if (humor <= data.face[i].expression.positive) {
	                    humor = data.face[i].expression.positive;
                        imgHumor = "static/icons/feliz.png";
                    }

                    var oImg = document.createElement("img");
                    oImg.setAttribute('src', imgHumor);
                    oImg.setAttribute('alt', imgAlt);
                    oImg.setAttribute('title', imgAlt);
                    newCell  = newRow.insertCell();
                    newCell.appendChild(oImg);

                }
            }
            else
            {
                $('#lista-pessoas').hide();
            }

            //
            // Prepara a exibição do reconhecimento de corpo e maos
            //
            if ( data.body.length > 0 || data.hand.length > 0 ) {

                $('#painel-texto').show();
                oculta_labels_reconhecimento();

                if ( data.body.length > 0 ) {
                    $('#texto-corpos').show();    
                    $('#valor-corpos').show();
                    $('#valor-corpos').text( data.body.length );
                    var corpoTitle = "";
                    for(var i = 0; i < data.body.length; i++) {
                        if (i > 0)
                            corpoTitle += ",\n";
                        corpoTitle += Math.round((data.body[i].confidence/1000)*100) + "%";
                    }
                    $('#valor-corpos').prop('title',corpoTitle);
                }

                if ( data.hand.length > 0 ) {
                    $('#texto-maos').show();    
                    $('#valor-maos').show();
                    $('#valor-maos').text( data.hand.length );
                    var maoTitle = "";
                    for(var i = 0; i < data.hand.length; i++) {
                        if (i > 0)
                            maoTitle += ",\n";
                        maoTitle += Math.round((data.hand[i].confidence/1000)*100) + "%";
                    }
                    $('#valor-maos').prop('title',maoTitle);                    
                }

            }
            else {
                
                // Oculta todos os elementos
                $('#painel-texto').hide();
                oculta_labels_reconhecimento();

            }

            $('#loading').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#loading').hide();
            alert("Ocorreu um erro durante a captura da imagem... :(");
        }
    });
}

function oculta_labels_reconhecimento() {
    $('#texto-corpos').hide();    
    $('#valor-corpos').hide();    
    $('#texto-maos').hide();    
    $('#valor-maos').hide();    
}

function reconhece_corpo(){
    jQuery.ajax({
        url     : 'ajax_corpo',
        type    : 'POST',
        dataType: 'json',
        success : function(data){

            var tableWrapper = "<h1 class=\"major\">Corpos Reconnhecidos<br></h1>";
            
            if ( data.body.length > 0 ) {
                tableWrapper += "<h1 class=\"major\">" + data.body.length + "</h1>";
            }
            else {
                tableWrapper += "<h1 class=\"major\">0</h1>"
            }

            $('#exposicao_dados').empty();
            $('#exposicao_dados').html( tableWrapper );

        }
    });
}

function reconhece_mao(){
    jQuery.ajax({
        url     : 'ajax_mao',
        type    : 'POST',
        dataType: 'json',
        success : function(data){

            var tableWrapper = "<h1 class=\"major\">Mãos Reconnhecidas<br></h1>";
            
            if ( data.hand.length > 0 ) {
                tableWrapper += "<h1 class=\"major\">" + data.hand.length + "</h1>";
            }
            else {
                tableWrapper += "<h1 class=\"major\">0</h1>"
            }

            $('#exposicao_dados').empty();
            $('#exposicao_dados').html( tableWrapper );

        }
    });
}