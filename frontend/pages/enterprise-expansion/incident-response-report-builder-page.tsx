import { EnterpriseExpansionFeaturePage, makeEnterpriseExpansionServerSideProps } from '../../features/enterprise-expansion/enterprise-expansion-feature-page';

export const getServerSideProps = makeEnterpriseExpansionServerSideProps('incidentResponse');

export default EnterpriseExpansionFeaturePage;
