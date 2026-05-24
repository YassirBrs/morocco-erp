import { EnterpriseOperationsFeaturePage, makeEnterpriseOperationsServerSideProps } from '../../features/enterprise-operations/enterprise-operations-feature-page';

export const getServerSideProps = makeEnterpriseOperationsServerSideProps('transporterReconciliation');

export default EnterpriseOperationsFeaturePage;
