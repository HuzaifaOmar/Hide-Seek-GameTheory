from flask import Blueprint, jsonify, request

from src.game.gamefacade import GameFacade, PlayerRole
from src.game.gamesimulation import GameSimulation

game_bp = Blueprint('game', __name__)

interactive_game = None
simulation_game = None


@game_bp.route('/initialize', methods=['POST'])
def initialize_game():
    data = request.json
    grid_size = data.get('grid_size', 4)
    grid_type = 'linear' if data.get('grid_type', 'linear') == 'linear' or data.get('grid_type', 'linear') == 'linear-approximation' else '2d'
    use_proximity = False if data.get('grid_type', 'linear') == 'linear' else True

    global interactive_game
    interactive_game = GameFacade(grid_size, grid_type, use_proximity)

    return jsonify({
        'status': 'success',
        'payoff_matrix': interactive_game.payoff_matrix.tolist(),
        'grid_size': grid_size,
        'grid_type': grid_type,
        'use_proximity': use_proximity,
        'place_types': [interactive_game.game_grid.get_place_type(i).name for i in range(grid_size)]
    })


@game_bp.route('/start-game', methods=['POST'])
def start_game():
    if not interactive_game:
        return jsonify({'status': 'error', 'message': 'Game not initialized. Call /initialize first.'}), 400

    data = request.json
    human_role = data.get('human_role', 'seeker')
    role = PlayerRole.HIDER if human_role.lower() == 'hider' else PlayerRole.SEEKER
    game_data = interactive_game.start_new_game(role)

    return jsonify({
        'status': 'success',
        'human_role': game_data['human_role'].value,
        'computer_role': game_data['computer_role'].value,
        'payoff_matrix': game_data['payoff_matrix'].tolist(),
        'computer_strategy': {
            'probabilities': game_data['computer_strategy']['probabilities'].tolist(),
        }
    })


@game_bp.route('/play-round', methods=['POST'])
def play_round():
    if not interactive_game or not interactive_game.is_game_running:
        return jsonify({'status': 'error', 'message': 'Game not running. Call /start-game first.'}), 400

    data = request.json
    human_position = data.get('human_position')
    if human_position is None:
        return jsonify({'status': 'error', 'message': 'Missing human_position parameter.'}), 400

    try:
        round_result = interactive_game.play_round(human_position)
        return jsonify({
            'status': 'success',
            'human_position': round_result['human_position'],
            'computer_position': round_result['computer_position'],
            'hider_position': round_result['hider_position'],
            'seeker_position': round_result['seeker_position'],
            'human_score': round_result['human_score'],
            'computer_score': round_result['computer_score'],
            'human_wins': round_result['human_wins'],
            'computer_wins': round_result['computer_wins'],
            'winner': round_result['winner'],
            'round_number': round_result['round_number']
        })
    except ValueError as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400


@game_bp.route('/reset-game', methods=['POST'])
def reset_game():
    if not interactive_game:
        return jsonify({'status': 'error', 'message': 'Game not initialized. Call /initialize first.'}), 400

    reset_data = interactive_game.reset_game()

    return jsonify({
        'status': 'success',
        'payoff_matrix': reset_data['payoff_matrix'].tolist()
    })


@game_bp.route('/get-game-state', methods=['GET'])
def get_game_state():
    if not interactive_game:
        return jsonify({'status': 'error', 'message': 'Game not initialized. Call /initialize first.'}), 400

    state = interactive_game.get_game_state()

    if state['human_role']:
        state['human_role'] = state['human_role'].value
    if state['computer_role']:
        state['computer_role'] = state['computer_role'].value
    state['payoff_matrix'] = state['payoff_matrix'].tolist()

    return jsonify({'game_state': state})


@game_bp.route('/run-simulation', methods=['POST'])
def run_simulation():
    data = request.json
    grid_size = data.get('grid_size', 4)
    grid_type = data.get('grid_type', 'linear')
    use_proximity = data.get('use_proximity', False)
    num_rounds = data.get('num_rounds', 100)

    global simulation_game
    simulation_game = GameSimulation(grid_size, grid_type, use_proximity)
    simulation_game.setup_simulation()
    simulation_game.run_simulation(num_rounds)

    state = simulation_game.game_facade.get_game_state()
    if state['human_role']:
        state['human_role'] = state['human_role'].value
    if state['computer_role']:
        state['computer_role'] = state['computer_role'].value
    state['payoff_matrix'] = state['payoff_matrix'].tolist()

    return jsonify({
        'status': 'success',
        'simulation_rounds': num_rounds,
        'human_score': simulation_game.game_facade.human_score,
        'computer_score': simulation_game.game_facade.computer_score,
        'human_wins': simulation_game.game_facade.human_wins,
        'computer_wins': simulation_game.game_facade.computer_wins,
        'game_state': state
    })


