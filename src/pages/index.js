import "./index.css";

import {
  setEventListners,
  settings,
  showInputError,
  hideInputError,
  checkInputValidity,
  toggleButtonState,
  disableBtn,
  resetValidation,
  enableValidation,
} from "../scripts/validation.js";

import Api from "../utils/Api.js";

// const initialCards = [
//   {
//     name: "Golden Gate Bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

// index.js

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "5aee9b68-99a9-4002-9f10-c257d8d11e46",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach((card) => {
      const cardElement = getCardElement(card);
      cardsList.append(cardElement);
    });
    profileNameEl.textContent = user.name;
    profileDescriptionEl.textContent = user.about;
    if (profileAvatarEl) {
      profileAvatarEl.src = user.avatar;
      profileAvatarEl.alt = `${user.name}'s profile picture`;
    }
  })
  .catch(console.error);

//Profile Modal Btn
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileSubmitBtn =
  editProfileModal.querySelector(".modal__submit-btn");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

//New Post modal btn
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = newPostModal.querySelector(".modal__form");
const newSubmitBtn = newPostModal.querySelector(".modal__submit-btn");
const newPostLinkInput = newPostModal.querySelector("#new-link-input");
const newPostCaptionInput = newPostModal.querySelector("#new-caption-input");

//Button for preview image (i.e clicking to enlarge image)
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

//Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCancel = document.querySelector(".modal__delete-cancel");
const deleteModalComfirm = deleteModal.querySelector(".modal__delete-comfirm");
//Edit avatar modal
const editAvatarModalBtn = document.querySelector(".profile__avatar-btn");
const editAvatarModal = document.querySelector("#profile-avatar-modal");
const editAvatarForm = editAvatarModal.querySelector(".modal__form");
const editAvatarSubmitBtn = editAvatarModal.querySelector(".modal__submit-btn");
const editAvatarLinkInput = editAvatarModal.querySelector(
  "#profile-avatar-input"
);
const profileAvatarEl = document.querySelector(".profile__avatar");

//Card related elements
const cardsList = document.querySelector(".cards__list");
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

let selectedCard, selectedCardId;

//Like button related elements

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  cardLikeBtnEl.addEventListener("click", (evt) => handleLike(evt, data._id));
  //If the card is liked, set the active class on the card
  if (data.isLiked) {
    cardLikeBtnEl.classList.add("card__like-btn_active");
  }
  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });
  cardDeleteBtnEl.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });
  deleteModalCancel.addEventListener("click", () => {
    closeModal(deleteModal);
  });
  return cardElement;
}

function handleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-btn_active");
  api
    .changeLikeStatus(id, isLiked)
    .then((updatedCard) => {
      evt.target.classList.toggle("card__like-btn_active");
    })
    .catch(console.error);
}

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal.modal_is-opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal")) {
    const openModal = document.querySelector(".modal_is-opened");
    if (openModal) {
      closeModal(openModal);
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
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
  openModal(editProfileModal);
});

const closeButtons = document.querySelectorAll(".modal__close-btn");

closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

editAvatarModalBtn.addEventListener("click", function () {
  openModal(editAvatarModal);
});

editProfileForm.addEventListener("submit", handleEditProfileSubmit);
newPostForm.addEventListener("submit", handleNewPostSubmit);
editAvatarForm.addEventListener("submit", handleEditAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  editProfileSubmitBtn.textContent = "Saving...";

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
    })
    .catch(console.error)
    .finally(() => {
      editProfileSubmitBtn.textContent = "Save";
    });

  closeModal(editProfileModal);
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  newSubmitBtn.textContent = "Saving...";

  api
    .addCardInfo({
      name: newPostCaptionInput.value,
      link: newPostLinkInput.value,
    })
    .then((card) => {
      const cardElement = getCardElement(card);
      cardsList.prepend(cardElement);
      newPostForm.reset();
      disableBtn(newSubmitBtn, settings);
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      newSubmitBtn.textContent = "Save";
    });
}

function handleEditAvatarSubmit(evt) {
  evt.preventDefault();

  const newAvatarUrl = editAvatarLinkInput.value;

  api
    .editAvatarInfo({ avatar: newAvatarUrl })
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      profileAvatarEl.alt = `${data.name}'s profile picture`;

      editAvatarForm.reset();
      disableBtn(editAvatarSubmitBtn, settings);
      closeModal(editAvatarModal);
    })
    .catch(console.error);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  deleteModalComfirm.textContent = "Deleting...";

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove(); // Remove the card from the page
      closeModal(deleteModal); // Close the delete modal
    })
    .catch(console.error)
    .finally(() => {
      deleteModalComfirm.textContent = "Delete";
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

enableValidation(settings);
