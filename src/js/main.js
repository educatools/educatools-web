const URL_PRODUCAO = 'https://mobile-tools.herokuapp.com';
const URL_DEV = "localhost:3000";

$(document).ready(() => {
  showAllRecommendations();
  searchForRecommendation();
  preparaModalFerramenta();
  $("#modalFerramenta").fitVids(); // faz com que o vídeo ocupe o espaço disponível no modal
});

function preparaModalFerramenta(){
  const modalFerramenta = document.getElementById('modalFerramenta');
  modalFerramenta.addEventListener("hide.bs.modal", (e) => {
    $("#iframe-youtube").attr("src", "");
  })
  
  modalFerramenta.addEventListener('show.bs.modal', function (e) {
    const button = e.relatedTarget;
    const recipient = button.getAttribute('data-bs-idFerramenta');
    // If necessary, you could initiate an AJAX request here
    // and then do the updating in a callback.
    buscaDadosDaFerramenta(recipient);
  })
}

function buscaDadosDaFerramenta(id) {
  $.ajax({
    url: `${URL_DEV}/ferramentas/${id}`,
    success: function (ferramenta) {
      alert("buscou a ferramenta");
      console.log("ferramenta", ferramenta);

      // Update the modal's content.
      var modalTitle = modalFerramenta.querySelector('.modal-title');
      var modalBodyInput = modalFerramenta.querySelector('.modal-body input');

      modalTitle.textContent = 'New message to ' + ferramenta.teste;
      modalBodyInput.value = ferramenta.teste;
    }
  });
}

document.getElementById("btnSendRecommendation").addEventListener("click", (event) => {
  event.preventDefault();
  saveRecomendation();
});

function saveRecomendation() {
  const data = {
    url: $("#urlFerramentaInput")[0].value,
    title: $("#ferramentaInput")[0].value,
    grades: $("#idealSelect")[0].value,
    username: $("#nomeCompletoInput")[0].value,
    description: $("#experienciaTextArea")[0].value,
    date: new Date()
  };

  $.post({
    data,
    url: `https://mobile-tools.herokuapp.com/save`,
    success: () => {
      $('#modalRecomendacao').modal('hide');
      alert('Sua recomendação foi enviada!');
    },
    error: (err) => {
      console.error("err", err);
      alert('Ocorreu um erro! =(');
    }
  });
}

function showAllRecommendations() {
  const url = 'https://mobile-tools.herokuapp.com/all';
  $.ajax({
    url,
    success: function (ferramentas) {
      let ferramentasHTML = [];
      if (ferramentas) {
        ferramentasHTML = ferramentas.map(({ title, thumbnail, description, url, isMobile, grades, username }) => {
          return new Ferramenta(title, thumbnail, description, url, isMobile, grades, username);
        });
      }

      //remove o loading
      $('#ferramentas').html('');

      // lista as ferramentas no HTML
      ferramentasHTML.forEach(ferramenta => {
        $('#ferramentas').append(ferramenta.montaFerramentaHTML());
      });
    }
  });
}

function searchForRecommendation() {
  // shows or hides the recommendations based on the user search
  $("#searchbox").on("keyup", function () {
    const searchTerm = $(this).val().toLowerCase();
    $(".ferramenta").filter(function () {
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

function Ferramenta(title, thumbnail, description, url, isMobile, grades, username) {
  this.url = url;
  this.title = title;
  this.username = username;
  this.description = description;
  this.grades = grades || 'Todos';
  this.isMobile = isMobile || false;
  this.thumbnail = thumbnail || 'https://via.placeholder.com/225x100';

  this.montaFerramentaHTML = function () {
    const hostname = new URL(this.url).hostname;
    const faviconSize = 15;
    const favicon = `https://api.faviconkit.com/${hostname}/${faviconSize}`;

    return `
      <div onclick="trocaConteudoModal('xxx')" class="col-sm-12 ferramenta filter ${this.__montaCategoriaClasse()}">
        <a href="javascript:void(0);" rel="noopener noreferrer" class="custom-card">
          <div class="card sm-12 box-shadow">
            <div class="card-body">
              <h5 class="card-title">
                <img src="${favicon}" style="padding-bottom: 5px;" width="25px"/>&nbsp ${this.title}
              </h5>
              <p class="card-text">${this.description}</p>
              <div class="d-flex justify-content-center align-items-center">
                <div class="flex-grow-1">
                  <small class="text-muted">para:&nbsp</small>
                  ${this.__montaBadges()}&nbsp&nbsp&nbsp${this.__isFeitoPelaMobile()}
                </div>
                <small class="text-muted"><b>sugerido por:</b> ${this.username}</small>
              </div>
            </div>
          </div>
        </a>
        </div>
      `
  };

  this.__montaCategoriaClasse = function () {
    const grades = new Map();
    grades.set('Infantil', 'infantil');
    grades.set('Ensino Fundamental 1', 'ef1');
    grades.set('Ensino Fundamental 2', 'ef2');
    grades.set('Ensino Fundamental', 'ef');
    grades.set('Todos', 'todos');

    return grades.get(this.grades);
  };

  this.__montaBadges = function () {
    const badges = new Map();
    badges.set('Infantil', { texto: 'Infantil', tipo: 'success' });
    badges.set('Ensino Fundamental 1', { texto: 'Ensino Fundamental 1', tipo: 'primary' });
    badges.set('Ensino Fundamental 2', { texto: 'Ensino Fundamental 2', tipo: 'danger' });
    badges.set('Ensino Fundamental', { texto: 'Ensino Fundamental', tipo: 'warning' });
    badges.set('Todos', { texto: 'Todos', tipo: 'info' });

    const { texto, tipo } = badges.get(this.grades);

    return `<span class="badge badge-${tipo}" title="${this.grades}">${texto}</span>`
  };

  this.__isFeitoPelaMobile = function () {
    if (this.isMobile) {
      return `<small class="text-muted"><i>✶ desenvolvido pela Móbile!</i></small>`
    }

    return '';
  }

}


$(".ferramenta").click(() => {
  console.log("passei aqui");
  const idFerramenta = $(this).attr("idFerramenta");
  trocaConteudoModal(idFerramenta);
});

function trocaConteudoModal(idFerramenta) {
  console.log("idFerramentaIdentificado", idFerramenta);
  $('#modalFerramenta').modal('show');
}





// BOTOES DE FILTRO
$(".filter-button").click(function () {
  var value = $(this).attr('data-filter');
  if (value == "all") {
    //$('.filter').removeClass('hidden');
    $('.filter').show('1000');
  }
  else {
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