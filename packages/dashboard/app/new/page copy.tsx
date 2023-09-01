const NewPage = () => {
  return (
    <main className="prose">
      <h1 className="text-3xl font-bold">Create a new project</h1>
      <p>
        Follow these instructions to setup AuthPortal for your Firebase project.
      </p>

      <h2>Copy the firebase app configuration:</h2>
      <p>
        Open your Firebase{" "}
        <a href="https://console.firebase.google.com/project/_/settings/general">
          project general settings
        </a>
        . Under the &quot;Your Apps&quot; section, select one of your Web apps
        and copy the initialization code here:
      </p>
      <textarea
        placeholder="const firebaseConfig = { ..."
        style={{ width: 600, height: 300 }}
        className="border border-black"
      ></textarea>
    </main>
  );
};

export default NewPage;
