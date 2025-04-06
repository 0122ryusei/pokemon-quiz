document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.generation-block input[type="checkbox"]').forEach(checkbox => {
        const block = checkbox.closest('.generation-block');
        // 初期状態も反映
        if (checkbox.checked) {
            block.classList.add('selected');
        }

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                block.classList.add('selected');
            } else {
                block.classList.remove('selected');
            }
        });
    });
});
