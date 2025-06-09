export function formatRupiah(salary) {
  let num = +salary;
  let text = num.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
  return text;
}
