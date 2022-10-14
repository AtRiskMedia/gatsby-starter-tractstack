import React from "react"
import axios from "axios"
import { useState } from "react"
import { concierge } from "gatsby-plugin-tractstack"

import config from "../../data/SiteConfig"

const FormContact = () => {
  const initialState = {
    name: "",
    company: "",
    email: "",
    consent: "",
    message: "",
  }
  const [state, setState] = useState(initialState)

  const handleInputChange = event => {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name
    setState({ [name]: value })
  }

  const handleSubmit = e => {
    const thatPayload = ["codeHook", ["form", "submit", "FormContact"]]
    concierge(thatPayload)
    e.preventDefault()
    if (
      state.name &&
      state.company &&
      state.email &&
      state.consent !== "-- select an option --" &&
      state.message
    ) {
      // skip for now
      if (state.consent === "yes") {
      }
      // next we send email
      var json = JSON.stringify({
        name: state.name,
        company: state.company,
        email: state.email,
        message: state.message,
        secret: process.env.API_SECRET_KEY,
      })
      axios({
        method: "post",
        url: config.url_sendmail,
        data: json,
      })
        .then(function (response) {
          //handle success
          document.getElementById("form__complete").style.visibility = "visible"
          document.getElementById("form__complete").style.display = "block"
          document.getElementById("form__incomplete").style.display = "none"
          //console.log(response);
          const thisPayload = ["codeHook", ["form", "submit", "FormContact"]]
          concierge(thisPayload)
        })
        .catch(function (response) {
          //handle error
          //console.log(response);
        })
    } else {
      setState({
        submitted: true,
      })
      handleInputChange(e)
    }
  }

  return (
    <div className="codehook codehook__form">
      <div className="codehook__inner">
        <h3 className="contact__subtitle">How can we help?</h3>
        <form className="contact" onSubmit={handleSubmit}>
          <label htmlFor="name">Your Full Name </label>
          {state.submitted && !state.message ? <span>*Required</span> : ""}
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={state.name}
            onBlur={handleInputChange}
            className={
              state.submitted && !state.name
                ? "contact__container--required"
                : ""
            }
          />

          <label htmlFor="email">Business Email </label>
          {state.submitted && !state.message ? <span>*Required</span> : ""}
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={state.email}
            onBlur={handleInputChange}
            className={
              state.submitted && !state.email
                ? "contact__container--required"
                : ""
            }
          />

          <label htmlFor="company">Company </label>
          {state.submitted && !state.message ? <span>*Required</span> : ""}
          <input
            type="text"
            id="company"
            name="company"
            defaultValue={state.company}
            onBlur={handleInputChange}
            className={
              state.submitted && !state.company
                ? "contact__container--required"
                : ""
            }
          />

          <label htmlFor="message">Message </label>
          {state.submitted && !state.message ? <span>*Required</span> : ""}
          <textarea
            id="message"
            name="message"
            defaultValue={state.message}
            onBlur={handleInputChange}
            className={
              state.submitted && !state.message
                ? "contact__container--required"
                : ""
            }
          />

          <label htmlFor="consent">Add to contacts? </label>
          {state.submitted && state.consent !== "yes" ? (
            <span>*Required</span>
          ) : (
            ""
          )}
          <select
            required
            id="consent"
            name="consent"
            defaultValue="-- select an option --"
            onBlur={handleInputChange}
            className={
              state.submitted && state.consent !== "yes"
                ? "contact__container--required"
                : ""
            }
          >
            <option hidden>-- select an option --</option>
            <option value="yes">Yes! Let&apos;s keep in touch.</option>
            <option value="no">No.</option>
          </select>

          <button type="submit">Let&apos;s&nbsp;Engage</button>
        </form>
        <div id="form__complete" className="form__complete">
          We will be in touch!
        </div>
      </div>
    </div>
  )
}

export default FormContact
