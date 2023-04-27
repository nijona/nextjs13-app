"use client";
import { formatDate } from "@/lib/utils";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Grid,
  Loading,
  Modal,
  Spacer,
  Text,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DeleteIcon = ({ onClick }: { onClick: Function }) => {
  const [hover, setHover] = useState(false);
  return (
    <svg
      style={{ marginLeft: "auto", cursor: "pointer" }}
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={() => onClick()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M20.2871 5.24297C20.6761 5.24297 21 5.56596 21 5.97696V6.35696C21 6.75795 20.6761 7.09095 20.2871 7.09095H3.71385C3.32386 7.09095 3 6.75795 3 6.35696V5.97696C3 5.56596 3.32386 5.24297 3.71385 5.24297H6.62957C7.22185 5.24297 7.7373 4.82197 7.87054 4.22798L8.02323 3.54598C8.26054 2.61699 9.0415 2 9.93527 2H14.0647C14.9488 2 15.7385 2.61699 15.967 3.49699L16.1304 4.22698C16.2627 4.82197 16.7781 5.24297 17.3714 5.24297H20.2871ZM18.8058 19.134C19.1102 16.2971 19.6432 9.55712 19.6432 9.48913C19.6626 9.28313 19.5955 9.08813 19.4623 8.93113C19.3193 8.78413 19.1384 8.69713 18.9391 8.69713H5.06852C4.86818 8.69713 4.67756 8.78413 4.54529 8.93113C4.41108 9.08813 4.34494 9.28313 4.35467 9.48913C4.35646 9.50162 4.37558 9.73903 4.40755 10.1359C4.54958 11.8992 4.94517 16.8102 5.20079 19.134C5.38168 20.846 6.50498 21.922 8.13206 21.961C9.38763 21.99 10.6811 22 12.0038 22C13.2496 22 14.5149 21.99 15.8094 21.961C17.4929 21.932 18.6152 20.875 18.8058 19.134Z"
        fill="#200E32"
        stroke={hover ? "#F31260" : "#9ba1a6"}
      />
    </svg>
  );
};

export default function Comment({
  userId,
  subscriptionStatus,
  id,
  name,
  avatar,
  createdAt,
  content,
}: {
  userId: string;
  subscriptionStatus: string;
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
  content: string;
}) {
  const { data: session } = useSession();
  const { user } = session || {};
  const isSubscribed = subscriptionStatus === "active";
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [visible, setVisible] = useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
  };

  function linkify(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const splitText = text.split(urlRegex);
    const jsxElements = splitText.map((s, i) => {
      if (s.match(urlRegex)) {
        return (
          <a href={s} target="_blank" rel="noopener noreferrer" key={i}>
            {s}
          </a>
        );
      }
      return <span key={i}>{s}</span>;
    });
    return jsxElements;
  }

  const linkifiedContent = linkify(content);

  const deleteComment = async (commentId: string) => {
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/deleteComment", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId }),
      });

      if (res.ok) {
        closeHandler();
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
    setDeleteLoading(false);
  };

  return (
    <>
      <Card
        css={{ paddingLeft: 6, paddingTop: 6, paddingBottom: 6 }}
        variant="bordered"
      >
        <Card.Header>
          {isSubscribed ? (
            <Badge disableOutline content="PRO" size="md" color="primary">
              <Avatar
                src={avatar}
                color="gradient"
                bordered={userId === user?.id}
              />
            </Badge>
          ) : (
            <Avatar
              src={avatar}
              color="gradient"
              bordered={userId === user?.id}
            />
          )}
          <Spacer x={0.5} />
          <Grid.Container css={{ pl: "$6" }}>
            <Grid xs={12}>
              <Text b>{name}</Text>
            </Grid>
            <Grid xs={12}>
              <Text css={{ color: "$accents8" }}>{formatDate(createdAt)}</Text>
            </Grid>
          </Grid.Container>
        </Card.Header>
        <Card.Body>
          <Text>{linkifiedContent}</Text>
        </Card.Body>
        {userId === user?.id && (
          <Card.Footer>
            <DeleteIcon onClick={handler} />
          </Card.Footer>
        )}
      </Card>
      <Spacer y={1} />

      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Are you sure you want to delete this comment?
          </Text>
        </Modal.Header>
        <Modal.Footer>
          <Button auto flat onPress={closeHandler}>
            Cancel
          </Button>
          <Button auto color="error" onPress={() => deleteComment(id)}>
            {deleteLoading ? (
              <Loading color="currentColor" size="sm" />
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
