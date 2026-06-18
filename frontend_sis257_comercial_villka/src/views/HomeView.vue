<script setup lang="ts">
import { ref } from 'vue'
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import Button from 'primevue/button'

const stats = ref([
  { icon: 'pi pi-check-circle', value: '8', label: 'Años Experiencia' },
  { icon: 'pi pi-users', value: '3', label: 'Técnicos Expertos' },
  { icon: 'pi pi-thumbs-up', value: '1000+', label: 'Clientes Satisfechos' },
  { icon: 'pi pi-car', value: '3000+', label: 'Vehículos Atendidos' },
])
</script>

<template>
  <div>
    <!-- Hero Carousel -->
    <div class="container-fluid p-0 mb-5 hero-carousel">
      <Carousel 
        :items-to-show="1" 
        :autoplay="4000" 
        :wrap-around="true"
        :transition="500"
        class="hero-carousel-inner"
      >
        <!-- Slide 1: Venta de Llantas -->
        <Slide :key="1">
          <div class="carousel-slide">
            <img 
              src="/img/carousel-bg-1.jpg" 
              class="carousel-bg"
              alt="Venta de Llantas"
            />
            <div class="carousel-overlay">
              <div class="container">
                <div class="row align-items-center">
                  <div class="col-lg-7 text-start">
                    <h6 class="text-accent text-uppercase mb-3 animate-slide-down">
                      // Venta de Llantas //
                    </h6>
                    <h1 class="display-3 text-white mb-4 fw-bold animate-slide-down">
                      Para todos los autos y en diferentes Marcas
                    </h1>
                    <Button
                      label="Ver Catálogo"
                      icon="pi pi-arrow-right"
                      iconPos="right"
                      class="p-button-lg btn-carserv animate-slide-down"
                      @click="$router.push('/llantas')"
                    />
                  </div>
                  <div class="col-lg-5 d-none d-lg-flex justify-content-end">
                    <img 
                      src="/img/carousel-1.png" 
                      class="img-fluid car-image animate-zoom"
                      alt="Auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        <!-- Slide 2: Auto Lavado -->
        <Slide :key="2">
          <div class="carousel-slide">
            <img 
              src="/img/carousel-bg-2.jpg" 
              class="carousel-bg"
              alt="Auto Lavado"
            />
            <div class="carousel-overlay">
              <div class="container">
                <div class="row align-items-center">
                  <div class="col-lg-7 text-start">
                    <h6 class="text-accent text-uppercase mb-3 animate-slide-down">
                      // Auto Lavado //
                    </h6>
                    <h1 class="display-3 text-white mb-4 fw-bold animate-slide-down">
                      Lavado de calidad con los mejores empleados
                    </h1>
                    <Button
                      label="Agendar Servicio"
                      icon="pi pi-arrow-right"
                      iconPos="right"
                      class="p-button-lg btn-carserv animate-slide-down"
                      @click="$router.push('/servicios?tipo=lavado')"
                    />
                  </div>
                  <div class="col-lg-5 d-none d-lg-flex justify-content-end">
                    <img 
                      src="/img/carousel-2.png" 
                      class="img-fluid car-image animate-zoom"
                      alt="Lavado"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        <!-- Indicadores y navegación -->
        <template #addons>
          <Pagination />
          <Navigation />
        </template>
      </Carousel>
    </div>
    <!-- Fin Carousel -->

    <!-- Sección de Estadísticas -->
    <div class="fact-section">
      <div class="container">
        <div class="row g-4">
          <div 
            v-for="stat in stats" 
            :key="stat.label"
            class="col-md-6 col-lg-3 text-center fact-item"
          >
            <i :class="stat.icon"></i>
            <h2>{{ stat.value }}</h2>
            <p class="mb-0">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de Servicios -->
    <div class="container py-5">
      <div class="text-center mb-5">
        <h6 class="text-accent text-uppercase">// Nuestros Servicios //</h6>
        <h1 class="mb-5">Explore Nuestros Servicios</h1>
      </div>
      
      <div class="row g-4">
        <div class="col-lg-4 col-md-6">
          <div class="service-item d-flex py-4 px-4">
            <i class="pi pi-shopping-cart text-accent flex-shrink-0" style="font-size: 3rem;"></i>
            <div class="ps-4">
              <h5 class="mb-3">Venta de Llantas</h5>
              <p>Las mejores marcas al mejor precio. Asesoramiento personalizado.</p>
              <Button 
                label="Ver Catálogo" 
                icon="pi pi-arrow-right"
                class="p-button-link"
                @click="$router.push('/llantas')"
              />
            </div>
          </div>
        </div>
        
        <div class="col-lg-4 col-md-6">
          <div class="service-item d-flex py-4 px-4">
            <i class="pi pi-car text-accent flex-shrink-0" style="font-size: 3rem;"></i>
            <div class="ps-4">
              <h5 class="mb-3">Lavado Profesional</h5>
              <p>Lavado básico, completo y premium. Cuidado detallado.</p>
              <Button 
                label="Agendar" 
                icon="pi pi-arrow-right"
                class="p-button-link"
                @click="$router.push('/servicios?tipo=lavado')"
              />
            </div>
          </div>
        </div>
        
        <div class="col-lg-4 col-md-6">
          <div class="service-item d-flex py-4 px-4">
            <i class="pi pi-sliders-h text-accent flex-shrink-0" style="font-size: 3rem;"></i>
            <div class="ps-4">
              <h5 class="mb-3">Alineamiento</h5>
              <p>Equipos modernos para alineamiento y balanceo preciso.</p>
              <Button 
                label="Reservar" 
                icon="pi pi-arrow-right"
                class="p-button-link"
                @click="$router.push('/servicios?tipo=alineamiento')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== CARRUSEL ===== */
.hero-carousel {
  position: relative;
  overflow: hidden;
}

.hero-carousel-inner :deep(.carousel__track) {
  height: 600px;
}

@media (max-width: 992px) {
  .hero-carousel-inner :deep(.carousel__track) {
    height: 450px;
  }
}

@media (max-width: 576px) {
  .hero-carousel-inner :deep(.carousel__track) {
    height: 350px;
  }
}

.carousel-slide {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

/* ===== Tiempo Transicion ===== */
.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.55);
  z-index: 10;
  display: flex;
  align-items: center;
}

.text-accent {
  color: #FF6B00 !important;
  font-weight: 600;
  letter-spacing: 3px;
  font-size: 1rem;
}

.btn-carserv {
  background-color: #FF6B00 !important;
  border: none !important;
  color: white !important;
  padding: 15px 35px !important;
  border-radius: 0 !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
  transition: all 0.3s ease !important;
}

.btn-carserv:hover {
  background-color: #1B1B1B !important;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* ===== ANIMACIONES ===== */
.animate-slide-down {
  animation: slideDown 1s ease forwards;
  opacity: 0;
}

.animate-slide-down:nth-child(1) { animation-delay: 0.2s; }
.animate-slide-down:nth-child(2) { animation-delay: 0.4s; }
.animate-slide-down:nth-child(3) { animation-delay: 0.6s; }

@keyframes slideDown {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-zoom {
  animation: zoomIn 1.2s ease forwards;
  opacity: 0;
  animation-delay: 0.5s;
}

@keyframes zoomIn {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.car-image {
  max-height: 400px;
  transition: transform 0.5s ease;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5));
}

.car-image:hover {
  transform: scale(1.05);
}

.hero-carousel-inner :deep(.carousel__pagination) {
  bottom: 20px;
}

.hero-carousel-inner :deep(.carousel__pagination-button::after) {
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  border: none;
}

.hero-carousel-inner :deep(.carousel__pagination-button--active::after) {
  background: #FF6B00;
  width: 30px;
  border-radius: 6px;
}

.hero-carousel-inner :deep(.carousel__prev),
.hero-carousel-inner :deep(.carousel__next) {
  width: 50px;
  height: 50px;
  background: #FF6B00;
  border-radius: 50%;
  color: white;
  transition: all 0.3s ease;
}

.hero-carousel-inner :deep(.carousel__prev:hover),
.hero-carousel-inner :deep(.carousel__next:hover) {
  background: #1B1B1B;
  transform: scale(1.1);
}

.hero-carousel-inner :deep(.carousel__prev) {
  left: 30px;
}

.hero-carousel-inner :deep(.carousel__next) {
  right: 30px;
}

.display-3 {
  font-size: 3.5rem;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

@media (max-width: 992px) {
  .display-3 {
    font-size: 2.5rem;
  }
}

@media (max-width: 576px) {
  .display-3 {
    font-size: 1.8rem;
  }
}

/* ===== SECCIÓN DE ESTADÍSTICAS ===== */
.fact-section {
  background: #1B1B1B;
  padding: 5rem 0;
}

.fact-item {
  text-align: center;
  color: white;
}

.fact-item i {
  font-size: 2.5rem;
  color: #FF6B00;
  margin-bottom: 1rem;
}

.fact-item h2 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

/* ===== SECCIÓN DE SERVICIOS ===== */
.service-item {
  background: #f8f9fa;
  transition: all 0.3s ease;
  border-radius: 0;
}

.service-item:hover {
  background: #FF6B00;
  color: white;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.service-item:hover h5,
.service-item:hover .text-accent {
  color: white !important;
}
</style>