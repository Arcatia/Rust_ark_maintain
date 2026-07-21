(() => {
  'use strict';

  const MESSAGE = 'RUST ARK ARCHIVE : ACCESS DENIED';

  function block(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  // 오른쪽 클릭 메뉴 차단
  document.addEventListener('contextmenu', block, true);

  // 이미지/비디오 드래그 저장 방지
  document.addEventListener('dragstart', event => {
    const target = event.target;
    if (
      target &&
      target.closest &&
      target.closest('img, video, canvas, .gallery-card, .media-frame, .ra-portrait, [data-protect]')
    ) {
      block(event);
    }
  }, true);

  // 이미지 선택 방지 보강
  document.addEventListener('selectstart', event => {
    const target = event.target;
    if (
      target &&
      target.closest &&
      target.closest('img, video, canvas, .gallery-card, .media-frame, .ra-portrait, [data-protect]')
    ) {
      block(event);
    }
  }, true);

  // 개발자도구/저장 관련 단축키 일부 차단
  document.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();

    const blocked =
      key === 'f12' ||
      (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(key)) ||
      (event.ctrlKey && ['s', 'u', 'p'].includes(key)) ||
      (event.metaKey && ['s', 'u', 'p'].includes(key));

    if (blocked) {
      block(event);
      console.warn(MESSAGE);
    }
  }, true);
})();
