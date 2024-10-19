/* All of the values should be written as:
data-testid=<<user-menu-button>> // For example: data-testid="user-menu-button"
*/

// Favicon and Logo
export const FAVICON_LOCATOR = 'favicon'
export const LOGO_LOCATOR = 'logo'

// Profile Button
export const PROFILE_BUTTON_LOCATOR = 'user-menu-button'
export const PROFILE_BUTTON_DROPDOWN_LOCATOR = 'user-dropdown-menu'

// Login
export const LOGIN_MODAL_LOCATOR = 'login-modal' // container element
export const LOGIN_CREDENTIAL_INPUT_LOCATOR = 'credential-input'
export const LOGIN_PASSWORD_INPUT_LOCATOR = 'password-input'
export const LOGIN_FORM_BUTTON_LOCATOR = 'login-button' // button to login
export const DEMO_USER_LOGIN_BUTTON_LOCATOR = 'demo-user-login' // button to login as demo

// Sign Up
export const SIGN_UP_FORM_LOCATOR = 'sign-up-form'
export const SIGN_UP_FIRST_NAME_INPUT_LOCATOR = 'first-name-input'
export const SIGN_UP_LAST_NAME_INPUT_LOCATOR = 'last-name-input'
export const SIGN_UP_EMAIL_INPUT_LOCATOR = 'email-input'
export const SIGN_UP_USERNAME_INPUT_LOCATOR = 'username-input'
export const SIGN_UP_PASSWORD_INPUT_LOCATOR = 'password-input'
export const SIGN_UP_CONFIRM_PASSWORD_INPUT_LOCATOR = 'confirm-password-input'
export const SIGN_UP_FORM_BUTTON_LOCATOR = 'form-sign-up-button'
export const SIGN_UP_EMAIL_ERROR_MESSAGE_LOCATOR = 'email-error-message'
export const SIGN_UP_USERNAME_ERROR_MESSAGE_LOCATOR = 'username-error-message'

// Landing Page
export const SPOT_LIST_LOCATOR = 'spots-list' // container element
export const SPOT_TILE_LOCATOR = 'spot-tile' // individual spot tile
export const SPOT_LINK_TO_SPOT_PAGE_LOCATOR = 'spot-link' // this is the element that should link to the single spot page
export const SPOT_THUMBNAIL_IMAGE_LOCATOR = 'spot-thumbnail-image'
export const SPOT_CITY_LOCATOR = 'spot-city'
export const SPOT_RATING_LOCATOR = 'spot-rating'
export const SPOT_PRICE_LOCATOR = 'spot-price'
export const SPOT_NAME_LOCATOR = 'spot-name'
export const SPOT_TOOLTIP_LOCATOR = 'spot-tooltip' // this is the element that should display the spot name on hover
export const CREATE_NEW_SPOT_BUTTON_LOCATOR = 'create-new-spot-button' // this is the element on the Navbar

// Spot Detail Page
export const SPOT_DETAIL_PAGE_TILE_LOCATOR = 'spot-tile'
export const SPOT_CALLOUT_BOX_LOCATOR = 'spot-callout-box'  // this is the box with the reserve button
export const SPOT_HEADING_LOCATOR = 'spot-name'
export const SPOT_DETAIL_PAGE_LOCATION_LOCATOR = 'spot-location'
export const SPOT_DETAIL_PAGE_CITY_LOCATOR = 'spot-city'
export const SPOT_LARGE_IMAGE_LOCATOR = 'spot-large-image'
export const SPOT_SMALL_IMAGE_LOCATOR = 'spot-small-image'
export const SPOT_HOST_LOCATOR = 'spot-host'
export const SPOT_DESCRIPTION_LOCATOR = 'spot-description'
export const SPOT_PRICE_DETAIL_PAGE_LOCATOR = 'spot-price'
export const SPOT_RESERVE_BUTTON_LOCATOR = 'reserve-button'
export const SPOT_DETAIL_PAGE_RATING_LOCATOR = 'spot-rating'

// Spot Detail Page -- Review Section
export const REVIEW_LIST_LOCATOR = 'review-list'
export const REVIEW_ITEM_LOCATOR = 'review-item'
export const REVIEW_DATE_LOCATOR = 'review-date'
export const REVIEW_TEXT_LOCATOR = 'review-text'
export const REVIEW_BUTTON_LOCATOR = 'review-button'
export const REVIEW_COUNT_LOCATOR = 'review-count'
export const REVIEW_HEADING_LOCATOR = 'reviews-heading'

// Create A Spot Form
export const CREATE_A_NEW_SPOT_FORM_LOCATOR = 'create-spot-form'
export const CREATE_A_NEW_SPOT_LOCATION_INPUT_LOCATOR = 'spot-location'
export const CREATE_A_NEW_SPOT_FORM_TITLE_LOCATOR = 'form-title'
export const CREATE_A_NEW_SPOT_SECTION_1_LOCATOR = 'section-1'
export const CREATE_A_NEW_SPOT_SECTION_2_LOCATOR = 'section-2'
export const CREATE_A_NEW_SPOT_SECTION_3_LOCATOR = 'section-3'
export const CREATE_A_NEW_SPOT_SECTION_4_LOCATOR = 'section-4'
export const CREATE_A_NEW_SPOT_SECTION_5_LOCATOR = 'section-5'
export const CREATE_A_NEW_SPOT_SECTION_1_HEADING_LOCATOR = 'section-1-heading'
export const CREATE_A_NEW_SPOT_SECTION_1_CAPTION_LOCATOR = 'section-1-caption'
export const CREATE_A_NEW_SPOT_SECTION_2_HEADING_LOCATOR = 'section-2-heading'
export const CREATE_A_NEW_SPOT_SECTION_2_CAPTION_LOCATOR = 'section-2-caption'
export const CREATE_A_NEW_SPOT_SECTION_3_HEADING_LOCATOR = 'section-3-heading'
export const CREATE_A_NEW_SPOT_SECTION_3_CAPTION_LOCATOR = 'section-3-caption'
export const CREATE_A_NEW_SPOT_SECTION_4_HEADING_LOCATOR = 'section-4-heading'
export const CREATE_A_NEW_SPOT_SECTION_4_CAPTION_LOCATOR = 'section-4-caption'
export const CREATE_A_NEW_SPOT_SECTION_5_HEADING_LOCATOR = 'section-5-heading'
export const CREATE_A_NEW_SPOT_SECTION_5_CAPTION_LOCATOR = 'section-5-caption'

// Create a Review Form
export const CREATE_A_REVIEW_FORM_LOCATOR = 'review-form'
export const CREATE_A_REVIEW_OPEN_MODAL_BUTTON_LOCATOR = 'review-button'
export const CREATE_A_REVIEW_CLICKABLE_STAR_LOCATOR = 'review-star-clickable'
export const CREATE_A_REVIEW_MODAL_LOCATOR = 'review-modal'

// Manage Spots
export const MANAGE_SPOTS_PPROFILE_DROPDOWN_LINK_LOCATOR = 'manage-spots-link'
export const MANAGE_SPOTS_PAGE_LIST_OF_SPOTS_LOCATOR = 'user-spots'

// Delete a Spot
export const DELETE_A_SPOT_MODAL_LOCATOR = 'delete-spot-modal'
export const DELETE_A_SPOT_CANCEL_BUTTON_LOCATOR = 'cancel-delete-spot-button'
export const DELETE_A_SPOT_CONFIRM_BUTTON_LOCATOR = 'confirm-delete-spot-button'

// Delete a Review
export const DELETE_A_REVIEW_MODAL_LOCATOR = 'delete-review-modal'
export const DELETE_A_REVIEW_CONFIRM_BUTTON_LOCATOR = 'confirm-delete-review-button'
