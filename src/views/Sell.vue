<template>
  <main role="main" class="pb-5">

    <PageHeader title="Publica un artículo">
      <p>Completa los datos del producto a vender</p>
    </PageHeader>

      <div class="container mt-5 p-4 listing">
        <div class="row justify-content-md-center">
          <div class="col-md-8 order-md-1">
            <h4 class="mb-3">Información del producto</h4>
            <form class="needs-validation" id="sell-info">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="productName">Nombre</label>
                  <input type="text" class="form-control" id="productName" placeholder="" value="" >
                  <div class="invalid-feedback">
                    Ingresa un nombre
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-8 order-md-1">
                    <label for="zip">Imágenes</label>
                    <div class="needsclick dz-clickable" id="file-upload">
                      <div class="dz-message needsclick">
                        Arrastra tus fotos aquí<br>
                      </div>
                    </div>
                </div>
              </div>
              <div class="row">
                  <div class="col-md-12 mb-3">
                      <label for="productDescription">Descripción</label>
                      <textarea class="form-control" id="productDescription" rows="3"></textarea>
                  </div>
                </div>
              <div class="row">
                <div class="col-md-3 mb-3">
                  <label for="zip">Costo</label>
                  <input type="number" class="form-control" id="productCostInput" placeholder="" required="" value="0" min="0">
                  <div class="invalid-feedback">
                    El costo debe ser mayor que 0.
                  </div>
                </div>
                <div class="col-md-4 mb-3">
                    <label for="state">Moneda</label>
                    <select class="custom-select d-block w-100" id="productCurrency" required="">
                      <option selected>Pesos Uruguayos (UYU)</option>
                      <option>Dólares (USD)</option>
                    </select>
                    <div class="invalid-feedback">
                      Ingresa una categoría válida.
                    </div>
                  </div>
              </div>
              <div class="row">
                  <div class="col-md-7 mb-3">
                  <label for="state">Categoría</label>
                  <select class="custom-select d-block w-100" id="productCategory">
                    <option value="">Elija la categoría...</option>
                    <option>Autos</option>
                    <option>Juguetes</option>
                    <option>Muebles</option>
                    <option>Herramientas</option>
                    <option>Computadoras</option>
                    <option>Vestimenta</option>
                  </select>
                  <div class="invalid-feedback">
                    Por favor ingresa una categoría válida.
                  </div>
                </div>
              </div>
              <div class="row">
                  <div class="col-md-3 mb-3">
                    <label for="productCountInput">Cantidad en stock</label>
                    <input type="number" class="form-control" id="productCountInput" placeholder="" required="" value="1" min="0">
                    <div class="invalid-feedback">
                      La cantidad es requerida.
                    </div>
                  </div>
                </div>
              <hr class="mb-4">
              <h5 class="mb-3">Tipo de publicación</h5>
              <div class="d-block my-3">
                <div class="custom-control custom-radio">
                  <input id="goldradio" name="publicationType" type="radio" class="custom-control-input" checked="" required="">
                  <label class="custom-control-label" for="goldradio">Gold (13%)</label>
                </div>
                <div class="custom-control custom-radio">
                  <input id="premiumradio" name="publicationType" type="radio" class="custom-control-input" required="">
                  <label class="custom-control-label" for="premiumradio">Premium (7%)</label>
                </div>
                <div class="custom-control custom-radio">
                  <input id="standardradio" name="publicationType" type="radio" class="custom-control-input" required="">
                  <label class="custom-control-label" for="standardradio">Estándar (3%)</label>
                </div>
                <div class="row">
                  <button type="button" class="m-1 btn btn-link" data-toggle="modal" data-target="#contidionsModal">Ver condiciones</button>
                </div>
              </div>
              <hr class="mb-4">
              <h4 class="mb-3">Costos</h4>
              <ul class="list-group mb-3">
                  <li class="list-group-item d-flex justify-content-between lh-condensed">
                    <div>
                      <h6 class="my-0">Precio</h6>
                      <small class="text-muted">Unitario del producto</small>
                    </div>
                    <span class="text-muted" id="productCostText">-</span>
                  </li>
                  <li class="list-group-item d-flex justify-content-between lh-condensed">
                    <div>
                      <h6 class="my-0">P0rcentaje</h6>
                      <small class="text-muted">Según el tipo de publicación</small>
                    </div>
                    <span class="text-muted" id="comissionText">-</span>
                  </li>
                  <li class="list-group-item d-flex justify-content-between">
                    <span>Total ($)</span>
                    <strong id="totalCostText">-</strong>
                  </li>
                </ul>
              <hr class="mb-4">
              <button class="btn btn-primary btn-lg" type="submit">Vender</button>
            </form>
          </div>
        </div>
      </div>

      <div class="alert fade" role="alert" id="alertResult">
          <span id="resultSpan"></span>
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
          </button>
      </div>

      <div class="modal fade" tabindex="-1" role="dialog" id="contidionsModal">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Condiciones de publicación</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="container">
                  <div class="row">
                      <h5 class="text-warning">Gold (13%)</h5>
                      <p class="muted text-justify">Tu producto se verá de forma promocionada en portada, además de las condiciones de Premium y Estándar.</p>
                  </div>
                  <hr>
                  <div class="row">
                      <h5 class="text-primary">Stándar (7%)</h5>
                      <p class="muted text-justify">Se mostrará el producto en los primeros lugares de resultados de búsqueda, así cómo cuando se ingrese a la categoría que pertenezca.</p>
                  </div>
                  <hr>
                  <div class="row">
                      <h5 class="text-secondary">Estándar (3%)</h5>
                      <p class="muted text-justify">El producto se listará en la categoría correspondiente, así como en los resultados de búsquedas que coincidan con las palabras claves en el nombre.</p>
                  </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>

  </main>
</template>

<script>
import PageHeader from '../components/General/PageHeader.vue';

export default {
  name: 'Sell',
  components: { PageHeader },
}
</script>

<style lang="scss" scoped>

.sell-section {
  background: #fff;
  border-radius: 0.6rem;
  box-shadow: 0.3rem 0.5rem 0.5rem #c0c0c047;
}

.listing {
  padding: 2.5rem;
  border-radius: .3rem;
  background-color: #fff;
  box-shadow: 0 3px 7px rgba(154,160,185,.05), 0 10px 40px rgba(166,173,201,.1);
}

.dropzone {
  border: 2px dashed #0087f7;
  border-radius: 5px;
  background: white;
}

</style>
