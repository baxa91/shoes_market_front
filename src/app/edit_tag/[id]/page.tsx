import TagForm from "@/app/components/TagForm";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <TagForm mode="edit" tagId={id} />;
}