import { siteConfig } from "@web/src/config/site"

/**
 * Email template for signup
 **/
function Signup(props: { link: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "4rem 1rem 0 1rem",
      }}
    >
      <div
        style={{
          fontFamily: '"Inter", Helvetica, Arial, sans-serif',
          width: "fit-content",
          padding: "1.5rem 1rem",
          border: "2.5px solid rgba(81, 84, 94, 0.7)",
          borderRadius: "calc(0.5rem - 2px)",
        }}
      >
        <h1
          style={{
            marginTop: 0,
            color: "rgb(51, 51, 51)",
            fontSize: 22,
            fontWeight: "bold",
            textAlign: "left",
          }}
        >
          Welcome to {siteConfig.name},
        </h1>
        <p
          style={{
            margin: "0.4em 0px 1.1875em",
            fontSize: 16,
            lineHeight: "1.625",
            color: "rgb(81, 84, 94)",
          }}
        >
          Click the link below to activate your account.
        </p>
        <p
          style={{
            margin: "0.4em 0px 1.1875em",
            fontSize: 16,
            lineHeight: "1.625",
          }}
        >
          <a
            href={props.link}
            target="_blank"
            style={{
              color: "rgb(255, 255, 255)",
              backgroundColor: "rgb(0, 0, 0)",
              padding: "10px 18px",
              display: "inline-block",
              textDecoration: "none",
              borderRadius: "calc(0.5rem - 2px)",
              boxSizing: "border-box",
            }}
          >
            Activate Account
          </a>
        </p>
        <p
          style={{
            margin: "0.4em 0px",
            fontSize: 16,
            lineHeight: "1.625",
            color: "rgb(81, 84, 94)",
          }}
        >
          This link expires in 24 hours and can only be used once.
        </p>
      </div>
    </div>
  )
}

export default Signup
