Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});

const statusList = {
    0: "pendiente",
    1: "despacho",
    2: "proceso",
    3: "viaje",
    4: "completado",
    5: "cancelado",
    6: "devuelto"
}