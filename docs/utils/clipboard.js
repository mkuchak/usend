import { createSharedComposable, useClipboard } from "@vueuse/core";

const useSharedClipboard = createSharedComposable(useClipboard);

export function copy(content) {
  const { copy: copyToClipboard } = useSharedClipboard();
  const button = event.currentTarget;
  copyToClipboard(content);
  button.classList.add("copied");
  setTimeout(() => button.classList.remove("copied"), 2000);
}

export function showButton(index) {
  const element = event.currentTarget;
  var table = element.closest("table");
  var ths = table.getElementsByTagName("th");
  const customClipboard = table.getElementsByClassName("custom-clipboard");

  for (let i = 0; i < ths.length; i++) {
    customClipboard[i].style.opacity = 0;
  }

  if (index !== -1) {
    customClipboard[index].style.opacity = 1;
  }
}
