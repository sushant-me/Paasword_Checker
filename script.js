document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const passwordInput = document.getElementById("password-input");
  const togglePassword = document.getElementById("toggle-password");
  const eyeIconOpen = document.getElementById("eye-icon-open");
  const eyeIconClosed = document.getElementById("eye-icon-closed");
  const strengthBar = document.getElementById("strength-bar");
  const strengthText = document.getElementById("strength-text");
  const suggestionBox = document.getElementById("suggestion-box");
  const suggestedPasswordText = document.getElementById("suggested-password");
  const copySuggestionBtn = document.getElementById("copy-suggestion");

  // Requirements configuration
  const requirements = [
    { id: "length", regex: /.{8,}/, score: 20 },
    { id: "lowercase", regex: /[a-z]/, score: 20 },
    { id: "uppercase", regex: /[A-Z]/, score: 20 },
    { id: "number", regex: /[0-9]/, score: 20 },
    { id: "symbol", regex: /[^A-Za-z0-9]/, score: 20 },
  ];

  // Icons
  const checkMarkIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>`;

  const xMarkIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>`;

  const copyIconDefault = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>`;

  const copyIconSuccess = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>`;

  // Event Listeners
  passwordInput.addEventListener("input", handlePasswordInput);
  togglePassword.addEventListener("click", togglePasswordVisibility);
  copySuggestionBtn.addEventListener("click", copySuggestedPassword);

  // Main password input handler
  function handlePasswordInput() {
    const password = passwordInput.value;

    if (password.length === 0) {
      resetUI();
      return;
    }

    let score = 0;

    // Check each requirement and update UI
    requirements.forEach((req) => {
      const reqEl = document.getElementById(req.id);
      const iconEl = reqEl.querySelector(".requirement-icon");

      if (req.regex.test(password)) {
        score += req.score;
        reqEl.classList.add("met");
        iconEl.innerHTML = checkMarkIcon;
      } else {
        reqEl.classList.remove("met");
        iconEl.innerHTML = xMarkIcon;
      }
    });

    updateStrengthUI(score, password);
  }

  // Generate a stronger password suggestion
  function generateStrongPassword(password) {
    if (!password) return "";

    let suggestion = password;
    const replacements = { a: "@", s: "$", o: "0", i: "!", e: "3" };

    // Replace common letters with symbols
    for (const char in replacements) {
      if (suggestion.includes(char)) {
        suggestion = suggestion.replace(
          new RegExp(char, "g"),
          replacements[char]
        );
        break;
      }
    }

    // Check what requirements are already met
    const has = {
      upper: /[A-Z]/.test(suggestion),
      num: /[0-9]/.test(suggestion),
      sym: /[^A-Za-z0-9]/.test(suggestion),
    };

    // Add missing character types
    if (!has.upper && suggestion.length > 0) {
      suggestion = suggestion.charAt(0).toUpperCase() + suggestion.slice(1);
    }

    if (!has.sym) {
      suggestion += "#";
    }

    if (!has.num) {
      suggestion += Math.floor(100 + Math.random() * 900);
    }

    // Ensure minimum length
    while (suggestion.length < 12) {
      suggestion += Math.floor(Math.random() * 10);
    }

    return suggestion;
  }

  // Update the strength meter and text
  function updateStrengthUI(score, password) {
    strengthBar.style.width = `${score}%`;

    if (score < 40) {
      strengthText.textContent = "Weak";
      strengthBar.style.backgroundColor = "var(--strength-weak)";
    } else if (score < 80) {
      strengthText.textContent = "Medium";
      strengthBar.style.backgroundColor = "var(--strength-medium)";
    } else {
      strengthText.textContent = score === 100 ? "Very Strong" : "Strong";
      strengthBar.style.backgroundColor =
        score === 100
          ? "var(--strength-very-strong)"
          : "var(--strength-strong)";
    }

    // Show suggestion if password is weak
    if (score < 80 && password.length > 0) {
      suggestedPasswordText.textContent = generateStrongPassword(password);
      suggestionBox.classList.remove("hidden");
    } else {
      suggestionBox.classList.add("hidden");
    }
  }

  // Reset the UI to initial state
  function resetUI() {
    strengthBar.style.width = "0%";
    strengthText.textContent = "";
    strengthBar.style.backgroundColor = "";
    suggestionBox.classList.add("hidden");

    requirements.forEach((req) => {
      const reqEl = document.getElementById(req.id);
      const iconEl = reqEl.querySelector(".requirement-icon");
      reqEl.classList.remove("met");
      iconEl.innerHTML = xMarkIcon;
    });
  }

  // Toggle password visibility
  function togglePasswordVisibility() {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    eyeIconOpen.classList.toggle("hidden", !isPassword);
    eyeIconClosed.classList.toggle("hidden", isPassword);
  }

  // Copy suggested password to clipboard
  function copySuggestedPassword() {
    const textToCopy = suggestedPasswordText.textContent;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        // Show success feedback
        copySuggestionBtn.innerHTML = copyIconSuccess;
        copySuggestionBtn.classList.add("text-green-400");

        // Reset after 2 seconds
        setTimeout(() => {
          copySuggestionBtn.innerHTML = copyIconDefault;
          copySuggestionBtn.classList.remove("text-green-400");
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  }
});
