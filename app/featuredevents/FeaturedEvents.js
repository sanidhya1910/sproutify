import SolutionCard from '@/components/solutions/SolutionCard'; // adjust path accordingly

const featuredEvents = [
  {
    id: '1',
    title: 'Beach Cleanup',
    description: 'Join us for a beach cleaning activity this weekend! Help preserve our coastline and make a difference.',
    imageUrl: '/images/beach-cleanup.jpg',
  },
  {
    id: '2',
    title: 'River Restoration',
    description: 'Volunteer with us to restore our local river ecosystem. Plant trees, remove debris, and improve the habitat for wildlife.',
    imageUrl: '/images/river-restoration.jpg',
  },
  {
    id: '3',
    title: 'Community Gardening',
    description: 'Get your hands dirty and help grow fresh produce in our community garden! No experience necessary - just come prepared to work hard.',
    imageUrl: '/images/community-gardening.jpg',
  },
];

const FeaturedEventsSection = ({events}) => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-8">Featured Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredEvents.map((event, index) => (
          <SolutionCard
            key={event.id}
            id={index}
            title={event.title}
            description={event.description}
            imageUrl={event.imageUrl}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedEventsSection;
