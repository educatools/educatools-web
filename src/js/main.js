const URL_API = window.location.href.substr(0, window.location.href.length - 1);
let FERRAMENTA_SELECIONADA = null;

$(document).ready(() => {
    mostraTodasFerramentas();
    configuraFiltrosDeBusca();
    configuraDisparosDoModal();

    // faz com que o vídeo ocupe o espaço todo disponível no modal
    $("#modalFerramenta").fitVids();
});

function configuraDisparosDoModal() {
    const modalFerramenta = document.getElementById('modalFerramenta');

    // HIDE
    modalFerramenta.addEventListener("hide.bs.modal", (e) => {
        const video = $('#modal-ferramenta-iframe-youtube').attr("src");
        $('#modal-ferramenta-iframe-youtube').attr("src", "");
        $('#modal-ferramenta-iframe-youtube').attr("src", video);
    });

    // SHOW
    modalFerramenta.addEventListener('show.bs.modal', function(e) {
        //FIXME: Alterar callback para async/await ou pelo menos Promises
        buscaDadosFerramenta(FERRAMENTA_SELECIONADA, (ferramenta) => {

            // Atualiza o modal de acordo com o conteúdo vindo da requisição AJAX
            const nome = modalFerramenta.querySelector('.modal-title');
            const descricao = modalFerramenta.querySelector('#modal-ferramenta-descricao p');
            const ciclo = modalFerramenta.querySelector('#modal-ferramenta-ciclos p');
            const url = modalFerramenta.querySelector("#modal-ferramenta-url");
            const usuario = modalFerramenta.querySelector("#modal-ferramenta-usuario p");
            const iframe = modalFerramenta.querySelector("#modal-ferramenta-iframe-youtube");

            nome.textContent = ferramenta.nome;
            descricao.textContent = ferramenta.descricao;
            url.setAttribute("href", ferramenta.url);
            usuario.textContent = `Está foi uma recomendação do(a) ${ferramenta.usuario}. Aproveite!`;
            ciclo.textContent = recomendacaoCiclosModal(ferramenta.ciclos);
            iframe.setAttribute("src", `https://www.youtube.com/embed/${ferramenta.video}`);
        });
    })
}

function recomendacaoCiclosModal(ciclos) {
    switch (ciclos) {
        case "todos": return "Ideal para todos os ciclos de aprendizagem";
        case "infantil": return "Ideal para ser usado no ensino infatil";
        case "fundamental 1": return "Ideal para ser usado no ensino fundamental 1 (1° ao 5° anos)";
        case "fundamental 2": return "Ideal para ser usado no ensino fundamental 2 (6° ao 9° anos)";
        case "médio": return "Ideal para ser usado no ensino médio";
        case "superior": return "Ideal para ser usado no ensino superior (graduação ou pós)";
    }
}

function buscaDadosFerramenta(id, callback) {
    $.ajax({
        url: `${URL_API}/ferramentas/detalhes/${id}`,
        success: (ferramenta) => callback(ferramenta)
    });
}

function mostraTodasFerramentas() {
    $.ajax({
        url: `${URL_API}/ferramentas/all`,
        success: function(ferramentas) {
            let ferramentasHTML = [];
            if (ferramentas) {
                ferramentasHTML = ferramentas.map(({ id, url, data, nome, descricao, ciclos, usuario }) => {
                    return new Ferramenta(id, url, data, nome, descricao, ciclos, usuario);
                });
            }

            $('#ferramentas').html(''); //remove o loading

            // lista as ferramentas no HTML
            ferramentasHTML.forEach(ferramenta => {
                $('#ferramentas').append(ferramenta.montaFerramentaHTML());
            });
        }
    });
}

function configuraFiltrosDeBusca() {
    // shows or hides the recommendations based on the user search
    $("#searchbox").on("keyup", function() {
        const searchTerm = $(this).val().toLowerCase();
        $(".ferramenta").filter(function() {
            const element = $(this);
            const title = element.find(".card-title").text().toLowerCase();
            const description = element.find(".card-body").text().toLowerCase();

            // looks up on the title and description
            if (title.indexOf(searchTerm) > -1 || description.indexOf(searchTerm) > -1) {
                element.show();
            } else {
                element.hide();
            }
        });

        // if there are no results, then shows a warning on the screen
        const results = $(".ferramenta:visible").length;
        const noResultsWarning = $("#warning:visible").length;
        if (results) $("#warning").hide();
        if (!results && !noResultsWarning) {
            $("#warning").show();
        }
    });
}

function Ferramenta(id, url, data, nome, descricao, ciclos, usuario) {
    this.id = id;
    this.url = url;
    this.data = data;
    this.nome = nome;
    this.descricao = descricao;
    this.ciclos = ciclos || 'Todos';
    this.usuario = usuario;

    this.montaFerramentaHTML = function() {
        const hostname = new URL(this.url).hostname;
        const faviconSize = 15;
        // FIXME: api depreciada
        // const favicon = `https://api.faviconkit.com/${hostname}/${faviconSize}`;
        const idFerramenta = this.id;

        return `
      <div onclick="abreModal('${idFerramenta}')" class="col-sm-12 ferramenta filter ${this.__montaCategoriaClasse()}">
        <a href="javascript:void(0);" rel="noopener noreferrer" class="custom-card">
          <div class="card sm-12 box-shadow">
            <div class="card-body">
              <h5 class="card-title">${this.nome}</h5>
              <p class="card-text">${this.descricao}</p>
              <div class="d-flex justify-content-center align-items-center">
                <div class="flex-grow-1">
                  <small class="text-muted">para:&nbsp</small>
                  ${this.__montaBadges()}
                </div>
                <small class="text-muted"><b>sugerido por:</b> ${this.usuario}</small>
              </div>
            </div>
          </div>
        </a>
        </div>
      `
    };

    this.__montaCategoriaClasse = function() {
        const ciclos = new Map();
        ciclos.set('infantil', 'infantil');
        ciclos.set('fundamental 1', 'fundamental-1');
        ciclos.set('fundamental 2', 'fundamental-2');
        ciclos.set('médio', 'médio');
        ciclos.set('superior', 'superior');
        ciclos.set('todos', 'todos');

        return ciclos.get(this.ciclos);
    };

    this.__montaBadges = function() {
        const badges = new Map();
        badges.set('infantil', { texto: 'Infantil', tipo: 'success' });
        badges.set('fundamental 1', { texto: 'Ensino Fundamental 1', tipo: 'primary' });
        badges.set('fundamental 2', { texto: 'Ensino Fundamental 2', tipo: 'danger' });
        badges.set('médio', { texto: 'Ensino Médio', tipo: 'warning' });
        badges.set('superior', { texto: 'Ensino Superior', tipo: 'info' });
        badges.set('todos', { texto: 'Todos', tipo: 'secondary' });

        const { texto, tipo } = badges.get(this.ciclos);
        return `<span class="badge bg-${tipo}" title="${this.ciclos}">${texto}</span>`;
    };
}

function abreModal(idFerramenta) {
    FERRAMENTA_SELECIONADA = idFerramenta;
    $('#modalFerramenta').modal('show');
}


// BOTOES DE FILTRO
$(".filter-button").click(function() {
    var value = $(this).attr('data-filter');
    if (value == "all") {
        //$('.filter').removeClass('hidden');
        $('.filter').show('1000');
    } else {
        //            $('.filter[filter-item="'+value+'"]').removeClass('hidden');
        //            $(".filter").not('.filter[filter-item="'+value+'"]').addClass('hidden');
        $(".filter").not('.' + value).hide('3000');
        $('.filter').filter('.' + value).show('3000');
    }
});

if ($(".filter-button").removeClass("active")) {
    $(this).removeClass("active");
}
$(this).addClass("active");
