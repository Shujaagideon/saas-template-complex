import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
} from "@react-email/components";

export function OrganisationInvitationEmail({
  invitationLink,
  organisationName,
}: {
  invitationLink: string;
  organisationName: string;
}) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Arial, sans-serif" }}>
        <Container>
          <Text>
            You&rsquo;ve been invited to create an organisation on our platform!
          </Text>
          <Text>Organisation Name: {organisationName}</Text>
          <Button
            href={invitationLink}
            style={{
              background: "#007bff",
              color: "white",
              padding: "10px 20px",
              textDecoration: "none",
            }}
          >
            Accept Invitation
          </Button>
          <Text>This invitation will expire in 24 hours.</Text>
        </Container>
      </Body>
    </Html>
  );
}