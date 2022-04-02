$(function () {
	new gridjs.Grid({
		columns: ["Date", "Players"],
		data: [
			["1/3/4023 10:89 UTC", "Nico, Nata, Cata, Kelsey, Papa, Mama, jfjf, dfjdljdffffffffffffff, ffffffffffffffffffffff, ffffffffffhfffffffffffffffffff"]
		]
		}).render($("#gridWrapper")[0]);
});
