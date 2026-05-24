insert into "Tenant" (
  id, slug, "tradeName", ice, "ifNumber", rc, patente, "cnssNumber",
  address, city, country, "vatEnabled", plan, status, "createdAt"
) values (
  'tenant-demo', 'demo-casa', 'Atlas Distribution SARL', '001525678000083',
  '1525678', 'CASA-425001', '34218811', '1234567',
  '45 Boulevard Abdelmoumen', 'Casablanca', 'MA', true,
  'ENTERPRISE', 'ACTIVE', now()
) on conflict (id) do nothing;

insert into "User" (id, "tenantId", email, "passwordHash", name, role, active, "createdAt")
values
  ('usr-owner', 'tenant-demo', 'owner@atlas.ma', 'demo1234', 'Nadia Benali', 'OWNER', true, now()),
  ('usr-accountant', 'tenant-demo', 'accountant@atlas.ma', 'demo1234', 'Cabinet Fiduciaire Casa', 'ACCOUNTANT', true, now())
on conflict ("tenantId", email) do nothing;
