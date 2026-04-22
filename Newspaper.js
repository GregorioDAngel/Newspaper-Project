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
	setTimeout(lockContent, 30000);

	if (subscribeBtn) {
		subscribeBtn.addEventListener("click", function () {
			alert("Thank you for subscribing!");
			unlockContent();
		});
	}

	if (closeBtn) {
		// Make the "Maybe later" button dodge the cursor
		closeBtn.style.position = "relative";

		const dodgeDistance = 30; // pixels
		const triggerRadius = 100; // distance from center where it starts to move

		closeBtn.addEventListener("mousemove", function (e) {
			const rect = closeBtn.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;

			const dx = e.clientX - centerX;
			const dy = e.clientY - centerY;
			const distance = Math.hypot(dx, dy);

			if (distance < triggerRadius) {
				// move opposite to cursor direction
				const angle = Math.atan2(dy, dx);
				const moveX = -Math.cos(angle) * dodgeDistance;
				const moveY = -Math.sin(angle) * dodgeDistance;

				// current offsets
				const currentLeft = parseFloat(closeBtn.dataset.left || "0");
				const currentTop = parseFloat(closeBtn.dataset.top || "0");

				let newLeft = currentLeft + moveX;
				let newTop = currentTop + moveY;

				// keep roughly within the overlay box
				const overlayRect = overlay.getBoundingClientRect();
				const btnWidth = rect.width;
				const btnHeight = rect.height;

				const minX = -overlayRect.width / 2 + btnWidth;
				const maxX = overlayRect.width / 2 - btnWidth;
				const minY = -overlayRect.height / 2 + btnHeight;
				const maxY = overlayRect.height / 2 - btnHeight;

				newLeft = Math.max(minX, Math.min(maxX, newLeft));
				newTop = Math.max(minY, Math.min(maxY, newTop));

				closeBtn.style.left = newLeft + "px";
				closeBtn.style.top = newTop + "px";

				closeBtn.dataset.left = newLeft;
				closeBtn.dataset.top = newTop;
			}
		});

		// Optional: still allow click if the user somehow catches it
		closeBtn.addEventListener("click", function () {
			lockContent();
		});
	}
});
