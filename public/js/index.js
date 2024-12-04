// 햄버거 메뉴 클릭 시 네비게이션 메뉴 토글
document
  .getElementById("hamburger-menu")
  .addEventListener("click", function () {
    const navbarLinks = document.getElementById("navbar-links");
    const hamburgerMenu = document.getElementById("hamburger-menu");

    navbarLinks.classList.toggle("active");
    hamburgerMenu.classList.toggle("active");
  });
