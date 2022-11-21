import React from "react"
import axios from "axios"
import { concierge, classNames } from "gatsby-plugin-tractstack"

import config from "../../data/SiteConfig"

const FormContact = () => {
  const [firstname, setFirstName] = React.useState("")
  const [lastname, setLastName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [company, setCompany] = React.useState("")
  const [bio, setBio] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)
  const [success, setSuccess] = React.useState(0)

  const handleSubmit = e => {
    e.preventDefault()
    console.log(firstname, lastname, company, email, bio)
    const thatPayload = ["codeHook", ["form", "submit", "Form"]]
    concierge(thatPayload)
    if (firstname && lastname && email) {
      // next we send email
      var json = JSON.stringify({
        firstname: firstname,
        lastname: lastname,
        company: company || ``,
        email: email,
        bio: bio || ``,
        secret: process.env.API_SECRET_KEY,
      })
      axios({
        method: "post",
        url: config.url_sendmail,
        data: json,
      })
        .then(function (response) {
          setSuccess(1)
          setSubmitted(true)
          console.log(response)
          const thisPayload = ["codeHook", ["form", "submit", "FormContact"]]
          concierge(thisPayload)
        })
        .catch(function (response) {
          setSuccess(-1)
          setSubmitted(true)
          console.log(response)
        })
    } else {
      setSubmitted(true)
      setSuccess(0)
    }
  }

  return (
    <form className="my-6" method="POST" onSubmit={handleSubmit}>
      <div className="bg-white px-4 py-5 shadow md:rounded-lg md:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="flex flex-col justify-center h-full md:max-w-sm xl:pl-12">
              <h3 className="text-3xl font-bold text-black md:text-4xl">
                At Risk Media{" "}
                <span className="text-orange tracking-tight">
                  capabilities deck
                </span>
              </h3>
              <p className="mt-4 text-xl text-gray-500">
                To unlock our capabilities deck for download, please introduce
                yourself.
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            {success === 0 ? (
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4 md:col-span-2">
                  <label
                    htmlFor="firstname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    autoComplete="given-name"
                    defaultValue={firstname}
                    onBlur={e => setFirstName(e.target.value)}
                    className={classNames(
                      "mt-1 block w-full rounded-md shadow-sm focus:border-orange focus:ring-orange md:text-sm",
                      submitted && firstname === ""
                        ? "border-red-500"
                        : "border-gray-300"
                    )}
                  />
                  {submitted && firstname === "" && (
                    <span className="text-xs px-2 text-red-500">
                      Required field.
                    </span>
                  )}
                </div>

                <div className="col-span-4 md:col-span-2">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    autoComplete="family-name"
                    defaultValue={lastname}
                    onBlur={e => setLastName(e.target.value)}
                    className={classNames(
                      "mt-1 block w-full rounded-md shadow-sm focus:border-orange focus:ring-orange md:text-sm",
                      submitted && firstname === ""
                        ? "border-red-500"
                        : "border-gray-300"
                    )}
                  />
                  {submitted && lastname === "" && (
                    <span className="text-xs px-2 text-red-500">
                      Required field.
                    </span>
                  )}
                </div>

                <div className="col-span-4 lg:col-span-2">
                  <label
                    htmlFor="email-address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    autoComplete="email"
                    defaultValue={email}
                    onBlur={e => setEmail(e.target.value)}
                    className={classNames(
                      "mt-1 block w-full rounded-md shadow-sm focus:border-orange focus:ring-orange md:text-sm",
                      submitted && firstname === ""
                        ? "border-red-500"
                        : "border-gray-300"
                    )}
                  />
                  {submitted && email === "" && (
                    <span className="text-xs px-2 text-red-500">
                      Required field.
                    </span>
                  )}
                </div>

                <div className="col-span-4 lg:col-span-2">
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    id="company"
                    defaultValue={company}
                    onBlur={e => setCompany(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange focus:ring-orange md:text-sm"
                  />
                </div>

                <div className="col-span-4 md:col-span-4">
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Short Bio
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange focus:ring-orange md:text-sm"
                      placeholder="Your one-liner bio"
                      defaultValue={""}
                      onBlur={e => setBio(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-span-4">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-slate-200 py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-orange hover:text-white focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
                  >
                    Submit
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center h-full">
                <h3 className="text-xl font-medium leading-6 text-gray-900">
                  Hello {firstname}!
                </h3>
                <div className="text-lg text-gray-500">
                  Click here to download our{" "}
                  <button className="inline-flex justify-center rounded-md border border-transparent bg-green py-2 px-3 text-sm font-medium text-allblack shadow-sm hover:bg-orange hover:text-white focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2">
                    Capabilities Deck
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}

export default FormContact
