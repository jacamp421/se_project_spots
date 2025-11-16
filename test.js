"use strict";

require("./index.css");

var _validationJs = require("./validation.js");

var initialCards = [{
  name: "Golden Gate Bridge",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg"
}, {
  name: "Val Thorens",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"
}, {
  name: "Restaurant terrace",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"
}, {
  name: "An outdoor cafe",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"
}, {
  name: "A very long bridge, over the forest and through the trees",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"
}, {
  name: "Tunnel with morning light",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"
}, {
  name: "Mountain house",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"
}];

var editProfileBtn = document.querySelector(".profile__edit-btn");
var editProfileModal = document.querySelector("#edit-profile-modal");
var editProfileForm = editProfileModal.querySelector(".modal__form");
var editProfileNameInput = editProfileModal.querySelector("#profile-name-input");

var editProfileDescriptionInput = editProfileModal.querySelector("#profile-description-input");

var newPostBtn = document.querySelector(".profile__add-btn");
var newPostModal = document.querySelector("#new-post-modal");
var newPostForm = newPostModal.querySelector(".modal__form");
var newSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
var newPostLinkInput = newPostModal.querySelector("#new-link-input");
var newPostCaptionInput = newPostModal.querySelector("#new-caption-input");

var previewModal = document.querySelector("#preview-modal");
var previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
var previewImageEl = previewModal.querySelector(".modal__image");
var previewCaptionEl = previewModal.querySelector(".modal__caption");

var cardTemplate = document.querySelector("#card-template").content.querySelector(".card");

var cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  var cardElement = cardTemplate.cloneNode(true);
  var cardTitleEl = cardElement.querySelector(".card__title");
  var cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  var cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  cardLikeBtnEl.addEventListener("click", function () {
    cardLikeBtnEl.classList.toggle("card__like-btn_active");
  });

  var cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtnEl.addEventListener("click", function () {
    cardElement.remove();
  });

  cardImageEl.addEventListener("click", function () {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

previewModalCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

var profileNameEl = document.querySelector(".profile__name");
var profileDescriptionEl = document.querySelector(".profile__description");

function handleEscape(evt) {
  if (evt.key === "Escape") {
    var _openModal = document.querySelector(".modal.modal_is-opened");
    if (_openModal) {
      closeModal(_openModal);
    }
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal")) {
    var _openModal2 = document.querySelector(".modal_is-opened");
    if (_openModal2) {
      closeModal(_openModal2);
    }
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscape);
  document.addEventListener("click", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscape);
  document.removeEventListener("click", handleOverlayClick);
}

editProfileBtn.addEventListener("click", function () {
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  editProfileNameInput.value = profileNameEl.textContent;
  (0, _validationJs.resetValidation)(editProfileForm, [editProfileNameInput, editProfileDescriptionInput], _validationJs.settings);
  openModal(editProfileModal);
});

var closeButtons = document.querySelectorAll(".modal__close-btn");

closeButtons.forEach(function (button) {
  var modal = button.closest(".modal");
  button.addEventListener("click", function () {
    return closeModal(modal);
  });
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  closeModal(editProfileModal);
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);
newPostForm.addEventListener("submit", handleNewPostSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  var inputValues = {
    link: newPostLinkInput.value,
    name: newPostCaptionInput.value
  };

  var cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);

  newPostForm.reset();
  (0, _validationJs.disableBtn)(newSubmitBtn, _validationJs.settings);
  closeModal(newPostModal);
}

initialCards.forEach(function (item) {
  var cardElement = getCardElement(item);
  cardsList.append(cardElement);
});

(0, _validationJs.enableValidation)(_validationJs.settings);
