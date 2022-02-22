//! 알게된 것
// 1. 비동기 -> 진동벨 비유
// 자바스크립트는 싱글 스레드 카페에서 내가 첫 주문을 한 뒤에 자리로 돌아가지 않으면
// 뒤에 사람이 기다리게 된다. 주문을 못한다.
// 진동벨을 받고 자리로 가 있으면 뒷 사람도 주문을 받을 수 있고, 나도 진동벨이 울리면 주문한 음료를 받을 수 있다
// 2. 생성할 때 POST, 수정할 때 PUT
// API 코드 리팩터링 /api 디렉토리에 관련 코드를 따로 저장
// 3. 이벤트 내부 코드
// 내부 코드가 길면 지저분하고 무슨 동작을 하는지 추후에 읽어야 되는 불편함이 있다.
// 함수로 분리해서 함수명으로 파악할 수 있게 하기
// api 통신이 실패한 경우 사용자에게 알려주기
// 중복된 항목 추가 막기

import { $ } from "./utils/dom.js";
import MenuApi from "./api/index.js";
// TODO 서버 요청 부분
// - [x] 웹 서버를 실행시킨다.
// - [x] 서버에 새로운 메뉴명이 추가될 수 있도록 요청한다.
// - [x] 서버에 카테고리별로 메뉴리스트를 불러오도록 요청한다.
// - [x] 서버에 메뉴 이름을 수정할 수 있도록 요청한다.
// - [x] 서버에 메뉴의 품절 상태를 토글될 수 있도록 요청한다.
// - [x] 서버에 메뉴가 삭제되도록 요청한다.

// TODO 리팩터링 부분
// - [x] localStorage에 저장하는 로직은 지운다.
// - [x] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

// TODO 사용자 경험
// - [x] 중복되는 메뉴는 추가할 수 없다.
// - [x] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 [alert](https://developer.mozilla.org/ko/docs/Web/API/Window/alert)으로 예외처리를 진행한다.

function App() {
  // 상태는 변하는 데이터, 이 앱에서 변하는 것은 무엇인가 -> 메뉴명
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.currentCategory = "espresso";

  this.init = async () => {
    render();
    initEventListeners();
  };

  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    const template = this.menu[this.currentCategory]
      .map((menuItem) => {
        return `
        <li data-menu-id="${
          menuItem.id
        }" class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name ${
            menuItem.isSoldOut ? "sold-out" : ""
          } ">${menuItem.name}</span>
            <button
              type="button"
              class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
            >
              품절
            </button>
            <button
              type="button"
              class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
            >
              수정
            </button>
            <button
              type="button"
              class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
            >
              삭제
            </button>
        </li>`;
      })
      .join("");

    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const addMenuName = async () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요");
      return;
    }
    const menuName = $("#menu-name").value;
    const duplicatedItem = this.menu[this.currentCategory].find(
      (menuItem) => menuItem.name === menuName
    );
    if (duplicatedItem) {
      alert("이미 등록된 메뉴입니다. 다시 입력해주세요.");
      $("#menu-name").value = "";
      return;
    }

    await MenuApi.createMenu(this.currentCategory, menuName);

    render();
    $("#menu-name").value = "";
  };

  const updateMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt(
      "수정할 메뉴 이름을 입력하세요",
      $menuName.innerText
    );
    await MenuApi.updateMenu(this.currentCategory, menuId, updatedMenuName);
    render();
  };

  const removeMenuName = async (e) => {
    if (confirm("삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      render();
    }
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldoutMenu(this.currentCategory, menuId);
    render();
  };

  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  };

  const initEventListeners = () => {
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    // form 태그가 자동으로 전송되는걸 막아준다.
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-submit-button").addEventListener("click", addMenuName);

    // 메뉴의 이름을 입력받는건
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }

      addMenuName();
    });

    $("nav").addEventListener("click", changeCategory);
  };
}

const app = new App();
app.init();
