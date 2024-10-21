const form = document.getElementById("form");
const customInputs = document.getElementById("customInputs");

document.querySelectorAll("input").forEach(e => {
    if (e.type == "radio")
    {
        e.addEventListener("click", e2 => {
            if (e2.target.value == "cliente")
            {
                let html = 
                `<hr><br>
                <div class="input">
                    <h5>Nombre negocio</h5>
                    <input type="text" name="storeName" id="storeName" required>
                </div>
                <div class="input">
                    <h5>Dirección negocio</h5>
                    <input type="text" name="storeAddress" id="storeAddress" required>
                </div>`
                
                customInputs.innerHTML = html;
            }
            else 
            {
                customInputs.innerHTML = '';
            }
        })
    }
});