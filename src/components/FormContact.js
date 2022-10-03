import React from "react"
import axios from "axios"
import config from "../../data/SiteConfig"

export default class FormContact extends React.Component {
  state = {
    name: "",
    company: "",
    email: "",
    consent: "",
    message: "",
  }

  handleInputChange = event => {
    const target = event.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value,
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    if (
      this.state.name &&
      this.state.company &&
      this.state.email &&
      this.state.consent !== "-- select an option --" &&
      this.state.message
    ) {
      // skip for now
      if (this.state.consent === "yes") {
      }
      // next we send email
      var json = JSON.stringify({
        name: this.state.name,
        company: this.state.company,
        email: this.state.email,
        message: this.state.message,
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
        })
        .catch(function (response) {
          //handle error
          //console.log(response);
        })
    } else {
      this.setState({
        submitted: true,
      })
      this.handleInputChange(event)
    }
  }

  render() {
    return (
      <div className="codehook codehook__form">
        <div className="codehook__inner">
          <h3 className="contact__subtitle">How can we help?</h3>
          <form className="contact" onSubmit={this.handleSubmit}>
            <label htmlFor="name">Your Full Name </label>
            {this.state.submitted && !this.state.message ? (
              <span>*Required</span>
            ) : (
              ""
            )}
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={this.state.name}
              onBlur={this.handleInputChange}
              className={
                this.state.submitted && !this.state.name
                  ? "contact__container--required"
                  : ""
              }
            />

            <label htmlFor="email">Business Email </label>
            {this.state.submitted && !this.state.message ? (
              <span>*Required</span>
            ) : (
              ""
            )}
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={this.state.email}
              onBlur={this.handleInputChange}
              className={
                this.state.submitted && !this.state.email
                  ? "contact__container--required"
                  : ""
              }
            />

            <label htmlFor="company">Company </label>
            {this.state.submitted && !this.state.message ? (
              <span>*Required</span>
            ) : (
              ""
            )}
            <input
              type="text"
              id="company"
              name="company"
              defaultValue={this.state.company}
              onBlur={this.handleInputChange}
              className={
                this.state.submitted && !this.state.company
                  ? "contact__container--required"
                  : ""
              }
            />

            <label htmlFor="message">Message </label>
            {this.state.submitted && !this.state.message ? (
              <span>*Required</span>
            ) : (
              ""
            )}
            <textarea
              id="message"
              name="message"
              defaultValue={this.state.message}
              onBlur={this.handleInputChange}
              className={
                this.state.submitted && !this.state.message
                  ? "contact__container--required"
                  : ""
              }
            />

            <label htmlFor="consent">Add to contacts? </label>
            {this.state.submitted && this.state.consent !== "yes" ? (
              <span>*Required</span>
            ) : (
              ""
            )}
            <select
              required
              id="consent"
              name="consent"
              defaultValue="-- select an option --"
              onBlur={this.handleInputChange}
              className={
                this.state.submitted && this.state.consent !== "yes"
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
}
