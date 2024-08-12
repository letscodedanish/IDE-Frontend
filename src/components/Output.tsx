
const INSTANCE_URI = "http://localhost:3000";

export const Output = () => {
    return <div style={{height: "100vh", background: "white"}}>
        <iframe width={"100%"} height={"100%"} src={`${INSTANCE_URI}`} />
    </div>
}