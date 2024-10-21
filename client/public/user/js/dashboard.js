const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

//Active sidebar
let path = window.location.pathname
sidebar.querySelectorAll("a").forEach(item=> {
	if (item.getAttribute("href") == path)
	{
		item.parentElement.classList.add("active")
	}
});

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})

if (window.innerWidth < 768) {
	sidebar.classList.add('hide');
}