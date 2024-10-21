const sidebarr = document.querySelector('#sidebar .side-menu');

let html = "";

if (user.group == 'cliente')
{
    html = `
    <li>
        <a href="/user/store">
            <i class='bx bx-store-alt'></i>
            <span class="text">Gestionar Local</span>
        </a>
    </li>
    <li>
        <a href="/user/pedidos">
            <i class='bx bx-package'></i>
            <span class="text">Gestionar pedidos</span>
        </a>
    </li>
    <li>
        <a href="/user/pedidos/create">
            <i class='bx bx-plus'></i>
            <span class="text">Crear pedidos</span>
        </a>
    </li>`
}
else if (user.group == 'paletizador')
{
    html = `
    <li>
        <a href="/user/paletizador/pedidos">
            <i class='bx bx-package'></i>
            <span class="text">Lista pedidos</span>
        </a>
    </li>`
}
else if (user.group == 'logistica')
{
    html = `
    <li>
        <a href="/user/logistica/pedidos">
            <i class='bx bx-package'></i>
            <span class="text">Lista pedidos</span>
        </a>
    </li>`
}
else if (user.group == 'conductor')
{
    html = `
    <li>
        <a href="/user/conductor/vehiculos">
            <i class='bx bxs-truck'></i>
            <span class="text">Lista de viajes</span>
        </a>
    </li>`
}
    

sidebarr.insertAdjacentHTML('beforeend', html);