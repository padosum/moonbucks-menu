// 오늘 얻은 인사이트
// 1. 이벤트 위임을 어떻게할 수 있는지 알게 되서 좋았다.
// 2. 요구사항을 전략적으로 접근해야하는지, 단계별로 세세하게 나누는게 중요하다는 것
// 3. DOM 요소를 가져올때 $표시를 써서 변수처럼 사용할 수 있게 하는 것
// 4. 새롭게 알게된 메서드
// - innerText,
// - innerHTML,
// - template literal,
// - insertAdjacentHTML,
// - cloest,
// - e.target

// step1 요구사항 구현을 위한 전략
// TODO 메뉴 추가
// - [x] 메뉴의 이름을 입력 받고 엔터키 입력으로 추가한다.
// - [x] 메뉴의 이름을 입력 받고 확인 버튼을 클릭하면 메뉴가 추가된다.
// - [x] 추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.
// - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.
// - [x] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// - [x] 사용자 입력값이 빈 값이라면 추가되지 않는다.

// TODO 메뉴 수정
// - [x] 메뉴의 수정 버튼 클릭하면 프롬프트 창이 뜬다.
// - [x] 프롬프트 창에서 새로운 메뉴 이름을 입력 받고 확인 버튼을 누르면 메뉴 이름이 수정된다.

const $ = (selector) => document.querySelector(selector);

const App = () => {
  // TODO 메뉴 삭제
  // - [x] 메뉴 삭제 버튼을 클릭하면 브라우저에서 제공하는 confirm 창이 뜬다.
  // - [x] 확인 버튼을 클릭하면 메뉴가 삭제된다.
  // - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.

  const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").childElementCount;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const addMenuName = () => {
    if ($("#espresso-menu-name").value === "") {
      alert("값을 입력해주세요");
      return;
    }

    const espressoMenuName = $("#espresso-menu-name").value;
    const menuItemTemplate = (espressoMenuName) => {
      return `
        <li class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
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
    };

    $("#espresso-menu-list").insertAdjacentHTML(
      "beforeend",
      menuItemTemplate(espressoMenuName)
    );
    updateMenuCount();
    $("#espresso-menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt(
      "수정할 메뉴 이름을 입력하세요",
      $menuName.innerText
    );
    $menuName.innerText = updatedMenuName;
  };

  const removeMenuName = (e) => {
    if (confirm("삭제하시겠습니까?")) {
      e.target.closest("li").remove();
      updateMenuCount();
    }
  };

  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }
    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });

  // form 태그가 자동으로 전송되는걸 막아준다.
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

  // 메뉴의 이름을 입력받는건
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }

    addMenuName();
  });
};

App();
