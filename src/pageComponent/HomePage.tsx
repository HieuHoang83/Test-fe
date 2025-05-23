import CustomerTable from "@/component/customer/CustomerTable";

export default function HomePage() {
  return (
    <>
      <div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 600,
            marginBottom: "10px",
            marginTop: "30px",
            textAlign: "center",
          }}
        >
          Danh sách khách hàng
        </h1>
      </div>
      <CustomerTable />;
    </>
  );
}
