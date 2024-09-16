
// const INSTANCE_URI = "https://ide-frontend-puce.vercel.app";
const INSTANCE_URI = "http://localhost:3000";

export const Output = () => {
    //use when running with kubernetes
    // const [searchParams] = useSearchParams();
    // const replId = searchParams.get('replId') ?? '';
    // const INSTANCE_URI = `http://${replId}.danish100x.me`;

    return <div style={{height: "100vh", background: "white"}}>
        <iframe width={"100%"} height={"100%"} src={`${INSTANCE_URI}`} />
    </div>
}