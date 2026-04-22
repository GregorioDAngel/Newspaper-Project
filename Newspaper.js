document.addEventListener("DOMContentLoaded", function () {
	const content = document.getElementById("content");
	const overlay = document.getElementById("paywall-overlay");
	const subscribeBtn = document.getElementById("paywall-subscribe-btn");
	const closeBtn = document.getElementById("paywall-close-btn");

	function lockContent() {
		if (content) {
			content.classList.add("paywalled");
			content.style.filter = "blur(4px)";
			content.style.pointerEvents = "none";
		}
		if (overlay) {
			overlay.style.display = "flex";
		}
	}

	function unlockContent() {
		if (content) {
			content.classList.remove("paywalled");
			content.style.filter = "none";
			content.style.pointerEvents = "auto";
		}
		if (overlay) {
			overlay.style.display = "none";
		}
	}

	// Show paywall after 1 minute on the page (60,000 ms)
	setTimeout(lockContent, 2000);

	if (subscribeBtn) {
		subscribeBtn.addEventListener("click", function () {
			alert("Thank you for subscribing!");
			window.open("tip.html", "_blank");
			unlockContent();
		});
	}

	if (closeBtn) {
		// Make the "Maybe later" button dodge the cursor
		closeBtn.style.position = "relative";

		const dodgeDistance = 30; // pixels per move
		const triggerRadius = 100; // start dodging when cursor is this close

		closeBtn.addEventListener("mousemove", function (e) {
			const paywallBox = document.querySelector(".paywall-box");
			if (!paywallBox) return;

			const boxRect = paywallBox.getBoundingClientRect();
			const btnRect = closeBtn.getBoundingClientRect();

			const centerX = btnRect.left + btnRect.width / 2;
			const centerY = btnRect.top + btnRect.height / 2;

			const dx = e.clientX - centerX;
			const dy = e.clientY - centerY;
			const distance = Math.hypot(dx, dy);

			if (distance < triggerRadius) {
				// move opposite to cursor direction
				const angle = Math.atan2(dy, dx);
				const moveX = -Math.cos(angle) * dodgeDistance;
				const moveY = -Math.sin(angle) * dodgeDistance;

				// current offsets (relative positioning)
				const currentLeft = parseFloat(closeBtn.dataset.left || "0");
				const currentTop = parseFloat(closeBtn.dataset.top || "0");

				let newLeft = currentLeft + moveX;
				let newTop = currentTop + moveY;

				// compute max allowed movement so the button never leaves the box
				const maxRightShift =
					boxRect.width - (btnRect.left - boxRect.left) - btnRect.width;
				const maxLeftShift = -(btnRect.left - boxRect.left);
				const maxDownShift =
					boxRect.height - (btnRect.top - boxRect.top) - btnRect.height;
				const maxUpShift = -(btnRect.top - boxRect.top);

				// clamp within those true bounds
				newLeft = Math.max(maxLeftShift, Math.min(maxRightShift, newLeft));
				newTop = Math.max(maxUpShift, Math.min(maxDownShift, newTop));

				closeBtn.style.left = newLeft + "px";
				closeBtn.style.top = newTop + "px";

				closeBtn.dataset.left = newLeft;
				closeBtn.dataset.top = newTop;
			}
		});

		// Still allow click if user catches it
		closeBtn.addEventListener("click", function () {
			lockContent();
		});
	}
});
