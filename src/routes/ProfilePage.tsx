import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LearningNote } from "../components/LearningNote";
import type { User } from "../types";
import { useTheme } from "../hooks/useTheme";

// Class component example for lifecycle comparison
class ProfileClassComponent extends React.Component<
  { userId: string },
  { user: User | null; loading: boolean; error: string | null }
> {
  constructor(props: { userId: string }) {
    super(props);
    this.state = {
      user: null,
      loading: true,
      error: null,
    };
  }

  async componentDidMount() {
    console.log("📊 [Profile Class] componentDidMount - fetching user");
    await this.fetchUser();
  }

  async componentDidUpdate(prevProps: { userId: string }) {
    if (prevProps.userId !== this.props.userId) {
      console.log("📊 [Profile Class] componentDidUpdate - userId changed");
      this.setState({ loading: true });
      await this.fetchUser();
    }
  }

  componentWillUnmount() {
    console.log("📊 [Profile Class] componentWillUnmount - cleanup");
  }

  fetchUser = async () => {
    try {
      console.log(`📊 [Profile Class] Fetching user ${this.props.userId}`);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data
      const userData: User = {
        id: this.props.userId,
        name: `User ${this.props.userId}`,
        email: `user${this.props.userId}@example.com`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.props.userId}`,
        bio: `I'm user number ${this.props.userId}. This is a mock profile created for demonstration purposes.`,
        location: ["Mumbai", "Noida", "Banglore", "Chennai", "Hyderabad"][
          Number(this.props.userId) % 5
        ],
      };

      this.setState({ user: userData, loading: false, error: null });
    } catch (error) {
      this.setState({
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch user",
      });
    }
  };

  render() {
    const { user, loading, error } = this.state;

    if (loading) {
      return <div className="text-center py-8">Loading class component...</div>;
    }

    if (error) {
      return (
        <div className="text-red-500 text-center py-8">Error: {error}</div>
      );
    }

    if (!user) {
      return <div className="text-center py-8">No user found</div>;
    }

    return (
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="font-bold text-blue-600 mb-2">Class Component Result</h3>
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h4 className="font-semibold">{user.name}</h4>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-600">📍 {user.location}</p>
          </div>
        </div>
      </div>
    );
  }
}

// Functional component with hooks
const ProfileFunctionalComponent: React.FC<{ userId: string }> = ({
  userId,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`📊 [Profile Hook] Fetching user ${id}`);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data
      const userData: User = {
        id,
        name: `User ${id}`,
        email: `user${id}@example.com`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
        bio: `I'm user number ${id}. This is a mock profile created for demonstration purposes.`,
        location: ["Mumbai", "Noida", "Banglore", "Chennai", "Hyderabad"][
          Number(id) % 5
        ],
      };

      setUser(userData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  // useEffect equivalent to componentDidMount and componentDidUpdate
  useEffect(() => {
    console.log("📊 [Profile Hook] useEffect triggered for userId:", userId);
    fetchUser(userId);
  }, [userId]);

  // useEffect equivalent to componentWillUnmount
  useEffect(() => {
    return () => {
      console.log("📊 [Profile Hook] Component cleanup");
    };
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">Loading functional component...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  }

  if (!user) {
    return <div className="text-center py-8">No user found</div>;
  }

  return (
    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
      <h3 className="font-bold text-green-600 mb-2">
        Functional Component Result
      </h3>
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h4 className="font-semibold">{user.name}</h4>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-600">📍 {user.location}</p>
          <p className="text-sm text-gray-500 mt-1">{user.bio}</p>
        </div>
      </div>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const userId = id || "1";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">
        Profile Viewer - Async Operations
      </h1>

      <div
        className={`p-6 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}>
        <h2 className="text-xl font-semibold mb-4">Dynamic Route Parameter</h2>
        <p className="mb-2">
          Current User ID: <strong>{userId}</strong>
        </p>
        <p className="text-sm text-gray-600">
          Try changing the URL to /profile/2, /profile/3, etc. to see different
          users.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Class Component Approach
          </h2>
          <ProfileClassComponent userId={userId} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            Functional Component with Hooks
          </h2>
          <ProfileFunctionalComponent userId={userId} />
        </div>
      </div>

      <LearningNote title="Profile Module - Async Operations & Lifecycle">
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-blue-600">
              Class vs Functional Components
            </h4>
            <p>
              <strong>Class Components:</strong> componentDidMount,
              componentDidUpdate, componentWillUnmount
            </p>
            <p>
              <strong>Functional Components:</strong> useEffect with different
              dependency arrays replaces lifecycle methods
            </p>
            <p>
              <strong>Modern preference:</strong> Functional components with
              hooks for cleaner, more reusable code
            </p>
          </div>

          <div>
            <h4 className="font-bold text-green-600">useEffect Patterns</h4>
            <p>
              • <code>useEffect(() =&gt; {}, [])</code> - Runs once on mount
              (componentDidMount)
            </p>
            <p>
              • <code>useEffect(() =&gt; {}, [dep])</code> - Runs when dep
              changes (componentDidUpdate)
            </p>
            <p>
              • <code>useEffect(() =&gt; () =&gt; cleanup, [])</code> - Cleanup
              on unmount
            </p>
          </div>

          <div>
            <h4 className="font-bold text-purple-600">
              Async Operations Best Practices
            </h4>
            <p>• Always handle loading and error states</p>
            <p>• Use try/catch blocks for error handling</p>
            <p>• Consider race conditions with cleanup</p>
            <p>• Show appropriate feedback to users</p>
          </div>

          <div>
            <h4 className="font-bold text-orange-600">Dynamic Routes</h4>
            <p>useParams hook extracts URL parameters</p>
            <p>Components re-render when route params change</p>
            <p>Perfect for user profiles, product pages, etc.</p>
          </div>
        </div>
      </LearningNote>
    </div>
  );
};

export default ProfilePage;
