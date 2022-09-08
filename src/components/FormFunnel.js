import React from "react"
import axios from "axios"
import config from "../../data/SiteConfig"

export default class FormFunnel extends React.Component {
  state = {
    last_name: "",
    account_name: "",
    email1: "",
    consent: "",
    campaign_id: "8f86263c-f597-af02-068e-60afc598d4c9",
    assigned_user_id: "1",
    moduleDir: "Leads",
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
      this.state.last_name &&
      this.state.account_name &&
      this.state.email1 &&
      this.state.consent
    ) {
      // do we have consent?
      if (this.state.consent !== "yes") {
        if (this.state.consent === "no") {
          document.getElementById("form__incomplete").style.display = "block"

          document.getElementById("consent").value = "-- select an option --"
          this.setState({
            submitted: true,
            consent: "-- select an option --",
          })
          this.handleInputChange(event)
        } else {
          this.setState({
            submitted: true,
          })
          this.handleInputChange(event)
          document.getElementById("form__incomplete").style.display = "none"
        }
      } else {
        // submit to CRM
        var bodyFormData = new FormData()
        bodyFormData.append("last_name", this.state.last_name)
        bodyFormData.append("account_name", this.state.account_name)
        bodyFormData.append("email1", this.state.email1)
        bodyFormData.append("campaign_id", this.state.campaign_id)
        bodyFormData.append("assigned_user_id", this.state.assigned_user_id)
        bodyFormData.append("moduleDir", this.state.moduleDir)

        axios({
          method: "post",
          url: config.url_suitecrm,
          data: bodyFormData,
        })
          .then(function (response) {
            //handle success
            //console.log(response);
          })
          .catch(function (response) {
            //handle error
            //console.log(response);
          })
        document.getElementById("form__incomplete").style.display = "none"
        document.getElementById("form__complete").style.display = "block"
      }
    } else {
      this.setState({
        submitted: true,
      })
      this.handleInputChange(event)
    }
  }

  render() {
    return (
      <>
        <form
          id="WebToLeadForm"
          name="WebToLeadForm"
          className="contact"
          onSubmit={this.handleSubmit}
        >
          <label htmlFor="last_name">Your Full Name </label>
          {this.state.submitted && !this.state.last_name ? (
            <span>*Required</span>
          ) : (
            ""
          )}
          <input
            type="text"
            id="last_name"
            name="last_name"
            defaultValue={this.state.last_name}
            onBlur={this.handleInputChange}
            className={
              this.state.submitted && !this.state.last_name
                ? "contact__container--required"
                : ""
            }
          />

          <label htmlFor="email1">Business Email </label>
          {this.state.submitted && !this.state.email1 ? (
            <span>*Required</span>
          ) : (
            ""
          )}
          <input
            type="email"
            id="email1"
            name="email1"
            defaultValue={this.state.email1}
            onBlur={this.handleInputChange}
            className={
              this.state.submitted && !this.state.email1
                ? "contact__container--required"
                : ""
            }
          />

          <label htmlFor="account_name">Company </label>
          {this.state.submitted && !this.state.account_name ? (
            <span>*Required</span>
          ) : (
            ""
          )}
          <input
            type="text"
            id="account_name"
            name="account_name"
            defaultValue={this.state.account_name}
            onBlur={this.handleInputChange}
            className={
              this.state.submitted && !this.state.account_name
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

          <button type="submit">Download&nbsp;Capabilities&nbsp;Deck</button>
        </form>
        <div id="form__complete" className="form__complete">
          Our deck will be mailed to you in one minute!
        </div>
        <div id="form__incomplete" className="form__incomplete">
          If you are taking our capabilities deck, we do ask to be acquainted.
          May we add you to our contacts for now?
        </div>
      </>
    )
  }
}
