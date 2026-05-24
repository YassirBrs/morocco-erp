import { EnterpriseAccelerationFeaturePage, makeEnterpriseAccelerationServerSideProps } from '../../features/enterprise-acceleration/enterprise-acceleration-feature-page';

export const getServerSideProps = makeEnterpriseAccelerationServerSideProps('verticalTemplateSelector');

export default EnterpriseAccelerationFeaturePage;
