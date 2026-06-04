<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">Comercial Vill-K</RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><RouterLink class="nav-link" to="/">Inicio</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/llantas">Llantas</RouterLink></li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/categorias">Categorías</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/servicios">Servicios</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/clientes">Clientes</RouterLink>
          </li>
          <li class="nav-item"><RouterLink class="nav-link" to="/login">Login</RouterLink></li>
        </ul>
      </div>
    </div>
  </nav>

  <main class="container mt-4">
    <RouterView />
  </main>
</template>
