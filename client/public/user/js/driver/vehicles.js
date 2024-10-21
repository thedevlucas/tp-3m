const items = document.getElementById("items");

for (let x of vehicles)
{
    let date = (new Date(x.date)).toLocaleDateString('es-AR');
    let html = `<tr>
        <td>${x.patent}</td>
        <td><a href="/user/conductor/vehiculos/view/${x.id}"><i class='bx bx-edit'></i></a></td>
    </tr>`

    items.insertAdjacentHTML('beforebegin', html);
}